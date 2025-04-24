'use client'
import { ReactNode, useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from 'react';

type ActionItem = {
  id: string;
  label: string;
  icon: ReactNode;
  color?: string;
  onClick: (row: any) => void;
};

export type ColumnDefinition<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  renderValue?: (row: T) => any;
  filterType?: "text" | "select" | "number" | "date";
  filterOptions?: { value: string; label: string }[];
  minWidth?: number | string;
};

type TableProps<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  pageSize?: number;
  getActions?: (row: T) => ActionItem[];
  className?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean,
  refresh?: () => void;
};

interface AscDes {
  label: "Ascending" | "Descending"
  value: "asce" | "dsce"
}

export function DataTable<T>({
  data,
  columns,
  pageSize = 10,
  getActions,
  className = "",
  onRowClick,
  loading = false,
  refresh = () => { }
}: TableProps<T>) {
  const [myData, setMyData] = useState(JSON.parse(JSON.stringify(data)));
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(
    columns.map(col => col.key)
  );
  const [selectedPageSize, setSelectedPageSize] = React.useState(pageSize);
  const [isAsec, setAsec] = React.useState<AscDes>({
    label: "Descending",
    value: 'asce',
  });

  // Filter data
  const filteredData = myData?.filter(row => {
    return Object.entries(filters).every(([key, value]) => {
      console.log({
        key,
        value,
      })
      if (!value.trim()) return true;

      const column = columns.find(col => col.key === key);
      if (!column) return true;

      const cellValue = String(column?.renderValue ? column.renderValue(row) : column.cell(row)).toLowerCase();
      return cellValue.includes(value.toLowerCase());
    });
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / selectedPageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * selectedPageSize,
    currentPage * selectedPageSize
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleColumnToggle = (key: string) => {
    setVisibleColumns(prev =>
      prev.includes(key)
        ? prev.filter(col => col !== key)
        : [...prev, key]
    );
  };

  const hasActions = typeof getActions === 'function';

  useEffect(() => {
    setMyData(data);
  },[data])

  return (
    <div className={`space-y-4 ${className}`} style={{ 
      minWidth: '800px',
      maxWidth: '1200px',
      overflowX: 'auto'
    }}>
      <div className="flex items-center justify-end gap-1">
        <Button size="sm" onClick={() => {
          if(isAsec.value === "asce"){
            setAsec({
              label: "Ascending",
              value: "dsce"
            });
          } else {
            setAsec({
              label: "Descending",
              value: "asce"
            });
          }
          console.log(myData,'myData');
          setMyData(myData.toReversed());
        }} variant="outline">
          {isAsec.label}
        </Button>
        <Button size="sm" onClick={refresh} variant="outline">
          Refresh
        </Button>
        {/* Column visibility dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map(column => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={visibleColumns.includes(column.key)}
                onCheckedChange={() => handleColumnToggle(column.key)}
              >
                {column.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter(column => visibleColumns.includes(column.key))
                .map(column => (
                  <TableHead key={column.key} style={{ minWidth: column.minWidth }}>
                    <div className="flex flex-col space-y-2">
                      <span>{column.header}</span>
                      {column?.filterType === "text" || column?.filterType === "number" || column?.filterType === "date" ? (
                        <Input
                          placeholder={`Filter ${column.header}`}
                          value={filters[column.key] || ""}
                          onChange={e => handleFilterChange(column.key, e.target.value)}
                          className="h-8 max-w-60"
                          type={column?.filterType || "text"}
                        />
                      ) : column?.filterType === "select" && column?.filterOptions && (
                        <Select
                          value={filters[column.key] || ""}
                          onValueChange={value => handleFilterChange(column.key, value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder={`All ${column.header}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=" ">All</SelectItem>
                            {column?.filterOptions && column?.filterOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableHead>
                ))}
              {hasActions && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => {
                const rowActions = getActions ? getActions(row) : [];

                return (
                  <TableRow
                    key={rowIndex}
                    onClick={() => onRowClick?.(row)}
                    className={onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                  >
                    {columns
                      .filter(column => visibleColumns.includes(column.key))
                      .map(column => (
                        <TableCell key={`${rowIndex}-${column.key}`}>
                          {column.cell(row)}
                        </TableCell>
                      ))}
                    {hasActions && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {rowActions.map(action => (
                            <Button
                              key={action.id}
                              variant="ghost"
                              size="icon"
                              className={action.color ? `text-${action.color}-500 hover:text-${action.color}-600 hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/20` : ''}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                            >
                              {action.icon}
                              <span className="sr-only">{action.label}</span>
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : loading ? '' : (
              <TableRow>
                <TableCell
                  colSpan={columns.filter(c => visibleColumns.includes(c.key)).length + (hasActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {loading && (
          <div className='text-center p-2'>
            Loading...
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <strong>
            {paginatedData.length > 0 ? (currentPage - 1) * selectedPageSize + 1 : 0}-
            {Math.min(currentPage * selectedPageSize, filteredData.length)}
          </strong>{" "}
          of <strong>{filteredData.length}</strong> items
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Page {currentPage} of {totalPages}</p>
            <Select
              value={`${selectedPageSize}`}
              onValueChange={value => {
                setSelectedPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={selectedPageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map(size => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}