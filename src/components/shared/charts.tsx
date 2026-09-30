"use client";

import { useLocale } from "next-intl";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

/**
 * Chart conventions (see dataviz guidance):
 * - Categorical colors in fixed order: --chart-1 (red), --chart-2 (blue), --chart-3 (amber). Max 3.
 * - One y-axis only, thin 2px lines, recessive grid, hover tooltip on every chart.
 * - Legend for ≥ 2 series; a single series is named by the card title.
 * - Every chart ships a data-table view for screen readers / non-visual access.
 */

export type XFormat = "day" | "month" | "week" | "category";

export type ChartSeries = {
  key: string;
  label: string;
  /** Index into the categorical palette, or "muted" for a de-emphasized context series. */
  color: 1 | 2 | 3 | "muted";
  /** Render as dots only (e.g. raw daily weigh-ins behind a moving average). */
  dotsOnly?: boolean;
};

type Row = Record<string, string | number>;

function colorVar(color: ChartSeries["color"]) {
  return color === "muted" ? "var(--muted-foreground)" : `var(--chart-${color})`;
}

function useFormatters(xFormat: XFormat, unit?: string) {
  const locale = useLocale();
  return useMemo(() => {
    const num = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    const compact = new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    });
    const day = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
    const month = new Intl.DateTimeFormat(locale, { month: "short" });
    const formatX = (v: string | number) => {
      if (xFormat === "day") return day.format(new Date(v));
      if (xFormat === "month") return month.format(new Date(v));
      if (xFormat === "week") return num.format(Number(v));
      return String(v);
    };
    const formatY = (v: number) => (unit ? `${num.format(v)} ${unit}` : num.format(v));
    const formatTick = (v: number) => compact.format(v);
    return { formatX, formatY, formatTick };
  }, [locale, xFormat, unit]);
}

type TooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: { dataKey?: string | number; value?: number | string }[];
};

/** Narrows Recharts' tooltip payload to the plain values this chart renders. */
function toTooltipProps({
  active,
  label,
  payload,
}: TooltipContentProps<ValueType, NameType>): TooltipProps {
  return {
    active,
    label: typeof label === "string" || typeof label === "number" ? label : undefined,
    payload: payload?.map((p) => ({
      dataKey: typeof p.dataKey === "function" ? undefined : p.dataKey,
      value: typeof p.value === "number" || typeof p.value === "string" ? p.value : undefined,
    })),
  };
}

function ChartTooltip({
  active,
  label,
  payload,
  series,
  formatX,
  formatY,
  xPrefix,
}: TooltipProps & {
  series: ChartSeries[];
  formatX: (v: string | number) => string;
  formatY: (v: number) => string;
  xPrefix?: string;
}) {
  if (!active || !payload?.length || label === undefined) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      <p className="mb-1 font-medium">
        {xPrefix ? `${xPrefix} ` : ""}
        {formatX(label)}
      </p>
      {payload.map((p) => {
        const s = series.find((x) => x.key === p.dataKey);
        if (!s || p.value === undefined) return null;
        return (
          <p key={s.key} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ background: colorVar(s.color) }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="ml-auto font-medium tabular-nums">{formatY(Number(p.value))}</span>
          </p>
        );
      })}
    </div>
  );
}

function Legend({ series }: { series: ChartSeries[] }) {
  if (series.length < 2) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <span
            className={s.dotsOnly ? "size-2 rounded-full" : "h-0.5 w-4 rounded-full"}
            style={{ background: colorVar(s.color) }}
          />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

function DataTable({
  data,
  xKey,
  xLabel,
  series,
  formatX,
  formatY,
  tableLabel,
}: {
  data: Row[];
  xKey: string;
  xLabel: string;
  series: ChartSeries[];
  formatX: (v: string | number) => string;
  formatY: (v: number) => string;
  tableLabel: string;
}) {
  return (
    <details className="text-xs">
      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
        {tableLabel}
      </summary>
      <div className="mt-2 max-h-56 overflow-auto rounded-md border">
        <table className="w-full text-left tabular-nums">
          <thead className="sticky top-0 bg-muted">
            <tr>
              <th className="px-2 py-1 font-medium">{xLabel}</th>
              {series.map((s) => (
                <th key={s.key} className="px-2 py-1 font-medium">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="px-2 py-1">{formatX(row[xKey] as string | number)}</td>
                {series.map((s) => (
                  <td key={s.key} className="px-2 py-1">
                    {formatY(Number(row[s.key]))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

type CommonProps = {
  data: Row[];
  xKey: string;
  xLabel: string;
  xFormat: XFormat;
  /** Shown before the x value in the tooltip, e.g. "Week". */
  xPrefix?: string;
  series: ChartSeries[];
  unit?: string;
  height?: number;
  ariaLabel: string;
  tableLabel: string;
};

export function TrendChart({
  data,
  xKey,
  xLabel,
  xFormat,
  xPrefix,
  series,
  unit,
  height = 260,
  ariaLabel,
  tableLabel,
}: CommonProps) {
  const { formatX, formatY, formatTick } = useFormatters(xFormat, unit);

  return (
    <figure className="flex flex-col gap-3">
      <Legend series={series} />
      <div role="img" aria-label={ariaLabel} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey={xKey}
              tickFormatter={formatX}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={formatTick}
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
              content={(props) => (
                <ChartTooltip
                  {...toTooltipProps(props)}
                  series={series}
                  formatX={formatX}
                  formatY={formatY}
                  xPrefix={xPrefix}
                />
              )}
            />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.dotsOnly ? "transparent" : colorVar(s.color)}
                strokeWidth={2}
                dot={
                  s.dotsOnly
                    ? { r: 2.5, fill: colorVar(s.color), stroke: "none", fillOpacity: 0.55 }
                    : false
                }
                activeDot={{ r: 5, stroke: "var(--card)", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <DataTable
        data={data}
        xKey={xKey}
        xLabel={xLabel}
        series={series}
        formatX={formatX}
        formatY={formatY}
        tableLabel={tableLabel}
      />
    </figure>
  );
}

export function BarsChart({
  data,
  xKey,
  xLabel,
  xFormat,
  xPrefix,
  series,
  unit,
  height = 240,
  ariaLabel,
  tableLabel,
  layout = "vertical",
}: CommonProps & { layout?: "vertical" | "horizontal" }) {
  const { formatX, formatY, formatTick } = useFormatters(xFormat, unit);
  const horizontal = layout === "horizontal";

  return (
    <figure className="flex flex-col gap-3">
      <Legend series={series} />
      <div role="img" aria-label={ariaLabel} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 8, right: 8, bottom: 0, left: horizontal ? 8 : -12 }}
            barCategoryGap="28%"
          >
            <CartesianGrid vertical={horizontal} horizontal={!horizontal} stroke="var(--border)" />
            {horizontal ? (
              <>
                <XAxis
                  type="number"
                  tickFormatter={formatTick}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey={xKey}
                  tickFormatter={formatX}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xKey}
                  tickFormatter={formatX}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={formatTick}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
              </>
            )}
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              content={(props) => (
                <ChartTooltip
                  {...toTooltipProps(props)}
                  series={series}
                  formatX={formatX}
                  formatY={formatY}
                  xPrefix={xPrefix}
                />
              )}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={colorVar(s.color)}
                radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                maxBarSize={40}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable
        data={data}
        xKey={xKey}
        xLabel={xLabel}
        series={series}
        formatX={formatX}
        formatY={formatY}
        tableLabel={tableLabel}
      />
    </figure>
  );
}
