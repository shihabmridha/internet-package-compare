import {useState, useMemo} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChevronUp, ChevronDown} from "lucide-react";
import {Package} from "@/package/package.ts";

const validityGroups = [
    {label: "All", value: "all"},
    {label: "3 days", value: 3},
    {label: "7 days", value: 7},
    {label: "15 days", value: 15},
    {label: "1 month", value: 30},
    {label: "Unlimited", value: Infinity},
];

interface PackageProps {
    packages: Package[]
}

export function PackageComparisonComponent({packages}: PackageProps) {
    const [sortBy, setSortBy] = useState<keyof Package>('price');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [groupBy, setGroupBy] = useState<string | number>("all");

    const filteredAndSortedPackages = useMemo(() => {
        return packages.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [packages, sortBy, sortOrder]);

    const groupedPackages = useMemo(() => {
        if (groupBy === "all") {
            return {all: filteredAndSortedPackages};
        }

        const groups: { [key: string | number]: Package[] } = {};
        validityGroups.forEach(group => {
            if (group.value !== "all") {
                groups[group.value] = filteredAndSortedPackages.filter(pkg =>
                    group.value === Infinity ? pkg.validity >= 30 : pkg.validity === group.value
                );
            }
        });
        return groups;
    }, [filteredAndSortedPackages, groupBy]);

    const handleSort = (column: keyof Package) => {
        if (column === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({column}: { column: keyof Package }) => {
        if (column !== sortBy) return null;
        return sortOrder === 'asc' ? <ChevronUp className="ml-2 h-4 w-4"/> : <ChevronDown className="ml-2 h-4 w-4"/>;
    };

    const handleVolume = (value: number): string => {
        if (value === Infinity) return "Unlimited";
        if (value < 1024) return `${value} MB`;

        return `${(value / 1024).toFixed(2)} GB`;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Mobile Internet Package Comparison</h1>

            <div className="flex flex-wrap gap-4 mb-4">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof Package)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="volume">Volume</SelectItem>
                        <SelectItem value="validity">Validity</SelectItem>
                        <SelectItem value="talkTime">Talk Time</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort order"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={groupBy.toString()}
                        onValueChange={(value) => setGroupBy(value === "Infinity" ? Infinity : value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Group by"/>
                    </SelectTrigger>
                    <SelectContent>
                        {validityGroups.map((group) => (
                            <SelectItem key={group.value.toString()} value={group.value.toString()}>
                                {group.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {Object.entries(groupedPackages).map(([key, packages]) => (
                <Card key={key} className="mb-6">
                    <CardHeader>
                        <CardTitle>{key === "all" ? "All Packages" : `${key} ${key === "Infinity" ? "days or more" : "days"}`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead onClick={() => handleSort('operator')}>
                                        Operator
                                        <SortIcon column="operator"/>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('title')}>
                                        Title
                                        <SortIcon column="title"/>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('price')}>
                                        Price (BDT)
                                        <SortIcon column="price"/>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('volume')}>
                                        Volume
                                        <SortIcon column="volume"/>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('validity')}>
                                        Validity (Days)
                                        <SortIcon column="validity"/>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('talkTime')}>
                                        Talk Time (Min)
                                        <SortIcon column="talkTime"/>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('sms')}>
                                        SMS
                                        <SortIcon column="sms"/>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {packages.map((pkg, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{pkg.operator.toUpperCase()}</TableCell>
                                        <TableCell>{pkg.title}</TableCell>
                                        <TableCell>{pkg.price}</TableCell>
                                        <TableCell>{pkg.volume === Infinity ? 'Unlimited' : handleVolume(pkg.volume)}</TableCell>
                                        <TableCell>{pkg.validity}</TableCell>
                                        <TableCell>{pkg.talkTime}</TableCell>
                                        <TableCell>{pkg.sms}</TableCell>
                                    </TableRow>
                                ))}
                                {packages.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">No packages available for this
                                            group</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}