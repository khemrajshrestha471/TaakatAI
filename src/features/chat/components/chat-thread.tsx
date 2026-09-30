"use client";

import { AlertTriangle, Bot, Send } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ThreadMessage = {
  id: string;
  from: "coach" | "client" | "ai";
  text: string;
  at: string;
  escalated?: boolean;
};

type Props = {
  messages: ThreadMessage[];
  /** Whose messages render on the right ("mine"). */
  self: "client" | "coach";
  names: { coach: string; client: string };
  mode: "coach" | "ai" | "readOnly";
  /** AI replies need ANTHROPIC_API_KEY; without it the AI composer explains that. */
  aiEnabled?: boolean;
};

export function ChatThread({ messages: initial, self, names, mode, aiEnabled = false }: Props) {
  const t = useTranslations("chat");
  const format = useFormatter();
  const [messages, setMessages] = useState(initial);
  const [draft, setDraft] = useState("");

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), from: self, text, at: new Date().toISOString() },
    ]);
    setDraft("");
    if (mode === "ai") toast.info(aiEnabled ? t("aiThinking") : t("aiDisabled"));
    else toast.info(t("syncSoon"));
  }

  const label = (from: ThreadMessage["from"]) =>
    from === "ai" ? t("assistant") : from === "coach" ? names.coach : names.client;

  return (
    <div className="flex h-[calc(100dvh-16rem)] min-h-96 flex-col overflow-hidden rounded-xl border bg-card lg:h-[calc(100dvh-14rem)]">
      <ol className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
        {messages.map((m) => {
          const mine = m.from === self;
          return (
            <li
              key={m.id}
              className={cn("flex max-w-[85%] flex-col gap-1", mine && "items-end self-end")}
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {m.from === "ai" && <Bot className="size-3.5" aria-hidden />}
                {label(m.from)} ·{" "}
                {format.dateTime(new Date(m.at), {
                  hour: "numeric",
                  minute: "2-digit",
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <p
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                  mine
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted",
                )}
              >
                {m.text}
              </p>
              {m.escalated && (
                <span className="flex items-center gap-1 text-xs text-warning">
                  <AlertTriangle className="size-3.5" aria-hidden /> {t("escalated")}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {mode === "readOnly" ? (
        <p className="border-t p-3 text-center text-xs text-muted-foreground">{t("readOnly")}</p>
      ) : (
        <form onSubmit={send} className="flex gap-2 border-t p-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={mode === "ai" ? t("askAi") : t("messageCoach", { name: names.coach })}
            aria-label={mode === "ai" ? t("askAi") : t("messageCoach", { name: names.coach })}
            className="h-11 text-base"
          />
          <Button type="submit" size="icon" className="size-11 shrink-0" aria-label={t("send")}>
            <Send aria-hidden />
          </Button>
        </form>
      )}
    </div>
  );
}
