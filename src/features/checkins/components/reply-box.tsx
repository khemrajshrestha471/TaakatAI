"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReplyBox({ id, placeholder }: { id: string; placeholder: string }) {
  const t = useTranslations("shared");
  const [text, setText] = useState("");
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        toast.info(t("actionSoon"));
      }}
    >
      <label htmlFor={`reply-${id}`} className="sr-only">
        {placeholder}
      </label>
      <Textarea
        id={`reply-${id}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="text-base"
      />
      <Button type="submit" className="h-11 w-fit" disabled={!text.trim()}>
        <Send aria-hidden /> {t("send")}
      </Button>
    </form>
  );
}
