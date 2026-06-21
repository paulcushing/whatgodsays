"use client";

import { useState } from "react";

import type { Struggle, Truth, TruthCategory } from "@/data/verseUtils";

type ComposeType = "truth" | "struggle";
type AddTruthInput = Omit<Truth, "id">;
type AddStruggleInput = Omit<Struggle, "id">;

export type ComposeEditing =
  | { kind: "truth"; value: Truth }
  | { kind: "struggle"; value: Struggle };

const truthCategories: TruthCategory[] = [
  "Purpose",
  "Identity",
  "Fear",
  "Anxiety",
  "Rejection",
  "Shame",
  "Failure",
  "Loneliness",
];

const struggleCategories: TruthCategory[] = [
  "Purpose",
  "Fear",
  "Anxiety",
  "Rejection",
  "Shame",
  "Failure",
  "Loneliness",
];

const defaultTruth: AddTruthInput = {
  category: "Identity",
  statement: "",
  reference: "",
  verse: "",
  reflectionQuestion: "",
  journalPrompt: "",
};

const defaultStruggle: AddStruggleInput = {
  label: "",
  category: "Anxiety",
  lie: "",
  truth: "",
  verses: [{ reference: "", verse: "" }],
  reflection: "",
  prayer: "",
};

function stripId<T extends { id: string }>(value: T): Omit<T, "id"> {
  const { id, ...rest } = value;
  void id;
  return rest;
}

export function CustomPromiseCompose({
  visible,
  onCancel,
  onSaveTruth,
  onSaveStruggle,
  editing,
  onUpdateTruth,
  onUpdateStruggle,
  onDelete,
}: {
  visible: boolean;
  onCancel: () => void;
  onSaveTruth: (truth: AddTruthInput) => void;
  onSaveStruggle: (struggle: AddStruggleInput) => void;
  editing?: ComposeEditing;
  onUpdateTruth?: (id: string, truth: AddTruthInput) => void;
  onUpdateStruggle?: (id: string, struggle: AddStruggleInput) => void;
  onDelete?: (editing: ComposeEditing) => void;
}) {
  const isEditing = Boolean(editing);
  const [type, setType] = useState<ComposeType>(editing?.kind ?? "truth");
  const [truth, setTruth] = useState<AddTruthInput>(
    editing?.kind === "truth" ? stripId(editing.value) : defaultTruth,
  );
  const [struggle, setStruggle] = useState<AddStruggleInput>(
    editing?.kind === "struggle" ? stripId(editing.value) : defaultStruggle,
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!visible) return null;

  const reset = () => {
    setType("truth");
    setTruth(defaultTruth);
    setStruggle(defaultStruggle);
  };

  const canSave =
    type === "truth"
      ? Boolean(
          truth.statement.trim() &&
            truth.reference.trim() &&
            truth.verse.trim() &&
            truth.reflectionQuestion.trim() &&
            truth.journalPrompt.trim(),
        )
      : Boolean(
          struggle.label.trim() &&
            struggle.lie.trim() &&
            struggle.truth.trim() &&
            struggle.verses[0].reference.trim() &&
            struggle.verses[0].verse.trim() &&
            struggle.reflection.trim() &&
            struggle.prayer.trim(),
        );

  const save = () => {
    if (!canSave) return;
    if (type === "truth") {
      const payload: AddTruthInput = {
        ...truth,
        statement: truth.statement.trim(),
        reference: truth.reference.trim(),
        verse: truth.verse.trim(),
        reflectionQuestion: truth.reflectionQuestion.trim(),
        journalPrompt: truth.journalPrompt.trim(),
      };
      if (editing?.kind === "truth") {
        onUpdateTruth?.(editing.value.id, payload);
      } else {
        onSaveTruth(payload);
      }
    } else {
      const payload: AddStruggleInput = {
        ...struggle,
        label: struggle.label.trim(),
        lie: struggle.lie.trim(),
        truth: struggle.truth.trim(),
        verses: [
          {
            reference: struggle.verses[0].reference.trim(),
            verse: struggle.verses[0].verse.trim(),
          },
        ],
        reflection: struggle.reflection.trim(),
        prayer: struggle.prayer.trim(),
      };
      if (editing?.kind === "struggle") {
        onUpdateStruggle?.(editing.value.id, payload);
      } else {
        onSaveStruggle(payload);
      }
    }
    reset();
  };

  const cancel = () => {
    reset();
    onCancel();
  };

  const remove = () => {
    if (!editing) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete?.(editing);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-page">
      <div className="w-full max-w-[480px] overflow-y-auto px-6 pb-11 pt-[max(env(safe-area-inset-top),48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-accent">
          {isEditing ? "Edit your promise" : "Add your own promise"}
        </p>
        <h1 className="mt-2.5 font-serif text-[30px] leading-[38px] text-scriptureInk">
          {isEditing
            ? `Edit this custom ${type}`
            : "Create a custom truth or struggle"}
        </h1>
        <p className="mt-2.5 text-sm leading-[21px] text-softInk">
          Include Scripture, a clear statement, and a reflection prompt so this
          entry is complete and useful later.
        </p>

        {!isEditing && (
          <div className="mt-[18px] flex gap-2.5">
            <TypeButton
              label="Truth"
              active={type === "truth"}
              onClick={() => setType("truth")}
            />
            <TypeButton
              label="Struggle"
              active={type === "struggle"}
              onClick={() => setType("struggle")}
            />
          </div>
        )}

        {type === "truth" ? (
          <div className="mt-[18px] flex flex-col gap-2">
            <FieldLabel label="Category" help="Pick the category this truth fits best." />
            <Options
              options={truthCategories}
              selected={truth.category}
              onSelect={(category) => setTruth((p) => ({ ...p, category }))}
            />
            <FieldLabel
              label="Truth statement"
              help="One clear sentence, like: You are loved and never alone."
            />
            <Field
              value={truth.statement}
              onChange={(v) => setTruth((p) => ({ ...p, statement: v }))}
              placeholder="You are ..."
            />
            <FieldLabel label="Scripture reference" help="For example: Romans 8:1" />
            <Field
              value={truth.reference}
              onChange={(v) => setTruth((p) => ({ ...p, reference: v }))}
              placeholder="Book Chapter:Verse"
            />
            <FieldLabel
              label="Verse text"
              help="Paste the verse text the statement is based on."
            />
            <Field
              multiline
              value={truth.verse}
              onChange={(v) => setTruth((p) => ({ ...p, verse: v }))}
              placeholder="Verse text..."
            />
            <FieldLabel
              label="Reflection question"
              help="Ask a heart-level question that invites response."
            />
            <Field
              value={truth.reflectionQuestion}
              onChange={(v) => setTruth((p) => ({ ...p, reflectionQuestion: v }))}
              placeholder="What is God inviting you to ...?"
            />
            <FieldLabel
              label="Journal prompt"
              help="Give a concrete writing prompt the user can respond to."
            />
            <Field
              value={truth.journalPrompt}
              onChange={(v) => setTruth((p) => ({ ...p, journalPrompt: v }))}
              placeholder="Write about ..."
            />
          </div>
        ) : (
          <div className="mt-[18px] flex flex-col gap-2">
            <FieldLabel
              label="Struggle label"
              help="This is the option users will tap, e.g. I feel rejected."
            />
            <Field
              value={struggle.label}
              onChange={(v) => setStruggle((p) => ({ ...p, label: v }))}
              placeholder="I feel ..."
            />
            <FieldLabel
              label="Category"
              help="Choose the emotional category this struggle belongs to."
            />
            <Options
              options={struggleCategories}
              selected={struggle.category}
              onSelect={(category) => setStruggle((p) => ({ ...p, category }))}
            />
            <FieldLabel label="Lie" help="Name the core lie in one sentence." />
            <Field
              value={struggle.lie}
              onChange={(v) => setStruggle((p) => ({ ...p, lie: v }))}
              placeholder="I am ..."
            />
            <FieldLabel
              label="Truth"
              help="State the gospel-centered truth that answers the lie."
            />
            <Field
              value={struggle.truth}
              onChange={(v) => setStruggle((p) => ({ ...p, truth: v }))}
              placeholder="In Christ ..."
            />
            <FieldLabel
              label="Main verse reference"
              help="Use one anchor reference for this struggle."
            />
            <Field
              value={struggle.verses[0].reference}
              onChange={(v) =>
                setStruggle((p) => ({
                  ...p,
                  verses: [{ ...p.verses[0], reference: v }],
                }))
              }
              placeholder="Book Chapter:Verse"
            />
            <FieldLabel
              label="Main verse text"
              help="Paste the verse text so it is available in the app."
            />
            <Field
              multiline
              value={struggle.verses[0].verse}
              onChange={(v) =>
                setStruggle((p) => ({
                  ...p,
                  verses: [{ ...p.verses[0], verse: v }],
                }))
              }
              placeholder="Verse text..."
            />
            <FieldLabel
              label="Reflection"
              help="Add a question that helps users process honestly."
            />
            <Field
              value={struggle.reflection}
              onChange={(v) => setStruggle((p) => ({ ...p, reflection: v }))}
              placeholder="What would it look like to ...?"
            />
            <FieldLabel
              label="Prayer"
              help="Write a short prayer users can pray in this struggle."
            />
            <Field
              multiline
              value={struggle.prayer}
              onChange={(v) => setStruggle((p) => ({ ...p, prayer: v }))}
              placeholder="Father, ... Amen."
            />
          </div>
        )}

        <div className="mt-[22px] flex flex-wrap items-center justify-end gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={remove}
              className={`mr-auto flex min-h-[48px] items-center rounded-full px-[18px] text-[15px] font-bold focus-ring ${
                confirmDelete
                  ? "bg-danger text-page"
                  : "border border-danger text-danger"
              }`}
            >
              {confirmDelete ? "Tap again to delete" : "Delete"}
            </button>
          )}
          <button
            type="button"
            onClick={cancel}
            className="flex min-h-[48px] items-center rounded-full px-[18px] text-[15px] font-bold text-softInk focus-ring"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={save}
            className={`flex min-h-[48px] items-center rounded-full px-6 text-[15px] font-extrabold focus-ring ${
              canSave ? "bg-ink text-page" : "bg-tint text-mutedInk"
            }`}
          >
            {isEditing ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TypeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[44px] items-center rounded-full border px-4 text-sm font-bold focus-ring ${
        active ? "border-ink bg-ink text-page" : "border-border bg-surface text-softInk"
      }`}
    >
      {label}
    </button>
  );
}

function FieldLabel({ label, help }: { label: string; help: string }) {
  return (
    <div>
      <p className="mt-2 text-[13px] font-extrabold text-ink">{label}</p>
      <p className="mt-0.5 text-xs leading-[18px] text-mutedInkAlt">{help}</p>
    </div>
  );
}

function Field({
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  const className =
    "mt-0.5 w-full rounded-md border border-borderSoft bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-mutedInk focus-ring";
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${className} min-h-[120px]`}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`${className} min-h-[44px]`}
    />
  );
}

function Options({
  options,
  selected,
  onSelect,
}: {
  options: TruthCategory[];
  selected: TruthCategory;
  onSelect: (value: TruthCategory) => void;
}) {
  return (
    <div className="mt-0.5 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`flex min-h-[36px] items-center rounded-full border px-3 text-xs font-bold focus-ring ${
              active
                ? "border-accentDeep bg-tint text-accentDeep"
                : "border-border bg-surface text-softInk"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
