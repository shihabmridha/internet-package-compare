import { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {Package} from "@/package/package.ts";
import {Operators} from "@/enums/operator.ts";
import {AssistantService} from "@/ai-assistant/service.ts";

interface PackageProps {
  packages: Package[]
}

const validityOptions = [
  { label: "All", value: "all" },
  { label: "3 days", value: "3" },
  { label: "7 days", value: "7" },
  { label: "15 days", value: "15" },
  { label: "1 month", value: "30" },
  { label: "Unlimited", value: "Infinity" },
];

type SortField = 'price' | 'volume' | 'validity';

interface SortState {
  field: SortField;
  order: 'asc' | 'desc';
}

export function PackageComparisonComponent({packages}: PackageProps) {
  const [primarySort, setPrimarySort] = useState<SortState>({field: 'price', order: 'asc'});
  const [filterValidity, setFilterValidity] = useState<string>("all");
  const [filterOperator, setFilterOperator] = useState<string>("all");
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [operators, setOperators] = useState<Set<Operators>>();
  const [assistantService, setAssistantService] = useState<AssistantService | null>(null);
  const [aiResult, setAiResult] = useState<string>("<p>Let AI help you find the best mobile internet package for your needs.</p>");
  const [modalButtonStatus, setModalButtonStatus] = useState<boolean>(false);

  useEffect(() => {
    const assistant = new AssistantService();
    setAssistantService(assistant);

    const storedApiKey = assistant.getApiKey();
    if (storedApiKey) {
      setGeminiApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    const operators = new Set(packages.map(pkg => pkg.operator));
    setOperators(operators);
  }, [packages]);

  const getOperatorOptions = () => {
    if (operators) {
      const options = Array.from(operators).map(operator => {
        return {
          label: operator.toString(),
          value: operator.toString()
        };
      });
      options.unshift({label: 'All', value: 'all'});
      return options;
    }
    return [];
  };


  const filteredAndSortedPackages = useMemo(() => {
    return [...packages]
        .filter(pkg =>
            (filterOperator === 'all' || pkg.operator === filterOperator) &&
            (filterValidity === 'all' || pkg.validity.toString() === filterValidity || (filterValidity === 'Infinity' && pkg.validity > 30))
        )
        .sort((a, b) => {
          // Primary sort
          if (a[primarySort.field] < b[primarySort.field]) return primarySort.order === 'asc' ? -1 : 1;
          if (a[primarySort.field] > b[primarySort.field]) return primarySort.order === 'asc' ? 1 : -1;

          return 0;
        });
  }, [packages, primarySort, filterValidity, filterOperator]);

  const SortIcon = ({field}: { field: SortField }) => {
    if (field === primarySort.field) {
      return primarySort.order === 'asc' ? <ChevronUp className="ml-2 h-4 w-4"/> :
          <ChevronDown className="ml-2 h-4 w-4"/>;
    }

    return null;
  };

  const handleSaveApiKey = () => {
    assistantService?.clearApiKey();
    assistantService?.setApiKey(geminiApiKey);
    setGeminiApiKey(geminiApiKey);
    setIsApiKeyModalOpen(false);
  };

  const handleSort = (field: SortField) => {
    setPrimarySort(prev => ({...prev, field: field, order: prev.order === 'asc' ? 'desc' : 'asc'}));
  };

  const handleSubmitAiPrompt = async (prompt: string) => {
    setModalButtonStatus(true);
    setAiResult("<p>Thinking...</p>");
    let response = await assistantService?.getSuggestion(prompt, filteredAndSortedPackages);
    response = response?.replace(/```html/g, '').replace(/```/g, '');

    setAiResult(response ?? "<p>Sorry, there was an error processing your query.</p>");
    setModalButtonStatus(false);
  };

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mobile Internet Package Comparison</h1>

        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <Select value={filterOperator} onValueChange={setFilterOperator}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Operator"/>
            </SelectTrigger>
            <SelectContent>
              {getOperatorOptions().map((op, i) => (
                  <SelectItem key={i} value={op.value}>
                    {op.label}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterValidity} onValueChange={setFilterValidity}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Validity"/>
            </SelectTrigger>
            <SelectContent>
              {validityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300">
                AI Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>AI Assistant</DialogTitle>
                <DialogDescription>
                  Enter your prompt to get AI assistance.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                    placeholder="Enter your prompt here..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                />

                {<div dangerouslySetInnerHTML={{__html: aiResult}} />}

                <Button onClick={async () => {
                  await handleSubmitAiPrompt(aiPrompt);
                }} disabled={modalButtonStatus}>
                  Submit
                </Button>
                <Button variant="outline" disabled={modalButtonStatus} onClick={() => setIsApiKeyModalOpen(true)}>
                  Set Gemini API Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set Gemini API Key</DialogTitle>
                <DialogDescription>
                  Enter your Gemini API key to enable AI assistance.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                />
                <Button onClick={handleSaveApiKey}>Save API Key</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operator</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('price')} className="font-semibold">
                      Price (BDT)
                      <SortIcon field="price"/>
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('volume')} className="font-semibold">
                      Volume (MB)
                      <SortIcon field="volume"/>
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('validity')} className="font-semibold">
                      Validity (Days)
                      <SortIcon field="validity"/>
                    </Button>
                  </TableHead>
                  <TableHead>Talk Time (Min)</TableHead>
                  <TableHead>SMS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPackages.map((pkg, i) => (
                    <TableRow key={i}>
                      <TableCell>{pkg.operator.toUpperCase()}</TableCell>
                      <TableCell>{pkg.title}</TableCell>
                      <TableCell>{pkg.price}</TableCell>
                      <TableCell>{pkg.volume === Infinity ? 'Unlimited' : pkg.volume}</TableCell>
                      <TableCell>{pkg.validity}</TableCell>
                      <TableCell>{pkg.talkTime}</TableCell>
                      <TableCell>{pkg.sms}</TableCell>
                    </TableRow>
                ))}
                {filteredAndSortedPackages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}
                                 className="text-center">{packages.length === 0 ? 'Loading...' : 'No packages found'}</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
}