"use client";

import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { JournalCompose } from "@/components/JournalCompose";
import { useJournal } from "@/hooks/useJournal";

const NEW_PROMPT = "What is God reminding you of today?";

export default function JournalScreen() {
  const journal = useJournal();
  const [composePrompt, setComposePrompt] = useState<string | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");

  const startNew = () => {
    setEditingEntryId(null);
    setEditingBody("");
    setComposePrompt(NEW_PROMPT);
  };

  const confirmDelete = (id: string) => {
    const ok =
      typeof window === "undefined" || typeof window.confirm !== "function"
        ? true
        : window.confirm(
            "Delete entry?\n\nThis reflection will be permanently removed.",
          );
    if (ok) journal.deleteEntry(id);
  };

  return (
    <>
      <AppShell activeTab="journal">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[1.6px] text-accent">
              Journal
            </p>
            <h1 className="mt-2 font-serif text-[34px] leading-[42px] text-scriptureInk">
              Make room for reflection
            </h1>
          </div>
          <button
            type="button"
            onClick={startNew}
            aria-label="New journal entry"
            className="flex h-11 w-11 items-center justify-center rounded-[22px] bg-tint text-[26px] leading-none text-accentDeep focus-ring"
          >
            +
          </button>
        </div>

        <div className="mt-[26px] flex flex-col gap-3.5">
          {journal.entries.length > 0 ? (
            journal.entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border border-borderSoft bg-surface p-5 shadow-soft"
              >
                <p className="text-xs font-extrabold uppercase tracking-[1.3px] text-accent">
                  {new Intl.DateTimeFormat(undefined, {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(entry.createdAt))}
                </p>
                <p className="mt-2.5 font-serif text-[20px] leading-7 text-scriptureInk">
                  {entry.prompt}
                </p>
                <p className="mt-2.5 whitespace-pre-wrap text-[15px] leading-[23px] text-softInk">
                  {entry.body}
                </p>
                <div className="mt-3.5 flex gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEntryId(entry.id);
                      setEditingBody(entry.body);
                      setComposePrompt(entry.prompt);
                    }}
                    aria-label="Edit journal entry"
                    className="flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm font-extrabold text-softInk focus-ring"
                  >
                    Edit <span aria-hidden>{"✎"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(entry.id)}
                    aria-label="Delete journal entry"
                    className="flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm font-extrabold text-accentDeep focus-ring"
                  >
                    Delete <span aria-hidden>{"\u{1F5D1}"}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-borderSoft bg-surface p-7 text-center">
              <p className="text-[15px] text-softInk">
                Your reflections will appear here.
              </p>
              <button
                type="button"
                onClick={startNew}
                className="mt-4 flex min-h-[44px] items-center rounded-full bg-ink px-[18px] text-sm font-extrabold text-page focus-ring"
              >
                Write a reflection
              </button>
            </div>
          )}
        </div>
      </AppShell>

      <JournalCompose
        key={
          editingEntryId ? `edit-${editingEntryId}` : `new-${composePrompt ?? "closed"}`
        }
        visible={composePrompt !== null}
        prompt={composePrompt ?? ""}
        initialBody={editingEntryId ? editingBody : ""}
        onCancel={() => {
          setComposePrompt(null);
          setEditingEntryId(null);
          setEditingBody("");
        }}
        onSave={(body) => {
          if (!composePrompt) return;
          if (editingEntryId) {
            journal.updateEntry(editingEntryId, body);
          } else {
            journal.addEntry({ prompt: composePrompt, body });
          }
          setComposePrompt(null);
          setEditingEntryId(null);
          setEditingBody("");
        }}
      />
    </>
  );
}
