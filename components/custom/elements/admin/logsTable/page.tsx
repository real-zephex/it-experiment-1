"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { readLogs } from "@/lib/db/functions/read";
type LogEntry = Awaited<ReturnType<typeof readLogs>>["data"][number];

type SortKey =
  | "transaction_time"
  | "transaction_type"
  | "affected_table"
  | "name"
  | "email";

type SortDir = "asc" | "desc";

const formatTime = (value: string) => {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toLocaleString();
};

const truncateMiddle = (value: string, start = 4, end = 4) => {
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
};

const LogsTable = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [tableFilter, setTableFilter] = useState("all");
  const [limit, setLimit] = useState(500);
  const [sortKey, setSortKey] = useState<SortKey>("transaction_time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchLogs = async (activeLimit: number) => {
    setLoading(true);
    setErrorMessage(null);
    const res = await readLogs({ limit: activeLimit });
    if (!res.status) {
      toast.error(res.message);
      setErrorMessage("Failed to load logs.");
      setLogs([]);
      setLoading(false);
      return;
    }
    setLogs(res.data);
    setLoading(false);
  };

  useEffect(() => {
    void fetchLogs(limit);
  }, [limit]);

  const transactionTypes = useMemo(() => {
    const values = Array.from(
      new Set(logs.map((log) => log.transaction_type).filter(Boolean)),
    ).sort();
    return ["all", ...values];
  }, [logs]);

  const affectedTables = useMemo(() => {
    const values = Array.from(
      new Set(logs.map((log) => log.affected_table).filter(Boolean)),
    ).sort();
    return ["all", ...values];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    let result = logs;
    const query = searchTerm.trim().toLowerCase();

    if (query) {
      result = result.filter((log) => {
        const fields = [
          log.email,
          log.name,
          log.clerk_user_id,
          log.transaction_type,
          log.affected_table,
          log.affected_user_id ?? "",
          log.transaction_time,
          String(log.id),
        ];
        return fields.some((field) => field.toLowerCase().includes(query));
      });
    }

    if (transactionFilter !== "all") {
      result = result.filter(
        (log) => log.transaction_type === transactionFilter,
      );
    }

    if (tableFilter !== "all") {
      result = result.filter((log) => log.affected_table === tableFilter);
    }

    const sorted = [...result];
    sorted.sort((a, b) => {
      if (sortKey === "transaction_time") {
        const timeA = Date.parse(a.transaction_time) || 0;
        const timeB = Date.parse(b.transaction_time) || 0;
        return sortDir === "asc" ? timeA - timeB : timeB - timeA;
      }

      const valueA =
        sortKey === "transaction_type"
          ? a.transaction_type
          : sortKey === "affected_table"
            ? a.affected_table
            : sortKey === "email"
              ? a.email
              : a.name;
      const valueB =
        sortKey === "transaction_type"
          ? b.transaction_type
          : sortKey === "affected_table"
            ? b.affected_table
            : sortKey === "email"
              ? b.email
              : b.name;

      const comparison = valueA
        .toLowerCase()
        .localeCompare(valueB.toLowerCase());
      return sortDir === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [logs, searchTerm, transactionFilter, tableFilter, sortKey, sortDir]);

  const handleSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDir(nextKey === "transaction_time" ? "desc" : "asc");
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Read-only log of admin and system activity.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={transactionFilter}
            onValueChange={setTransactionFilter}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {transactionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All types" : type.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tableFilter} onValueChange={setTableFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All tables" />
            </SelectTrigger>
            <SelectContent>
              {affectedTables.map((table) => (
                <SelectItem key={table} value={table}>
                  {table === "all" ? "All tables" : table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(limit)}
            onValueChange={(value) => setLimit(Number(value))}
          >
            <SelectTrigger className="w-full sm:w-28">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="1000">1000</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => void fetchLogs(limit)}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            {errorMessage ?? "A chronological view of recent system activity."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[60dvh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 sticky top-0 z-10">
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-2 h-8 px-2"
                      onClick={() => handleSort("transaction_time")}
                    >
                      <span>Time</span>
                      {renderSortIcon("transaction_time")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-2 h-8 px-2"
                      onClick={() => handleSort("transaction_type")}
                    >
                      <span>Type</span>
                      {renderSortIcon("transaction_type")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-2 h-8 px-2"
                      onClick={() => handleSort("affected_table")}
                    >
                      <span>Table</span>
                      {renderSortIcon("affected_table")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-2 h-8 px-2"
                      onClick={() => handleSort("name")}
                    >
                      <span>Actor</span>
                      {renderSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Affected User</TableHead>
                  <TableHead className="font-semibold">Clerk ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTime(log.transaction_time)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="capitalize">
                          {log.transaction_type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {log.affected_table}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{log.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {log.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.affected_user_id ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {truncateMiddle(log.clerk_user_id, 4, 4)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsTable;
