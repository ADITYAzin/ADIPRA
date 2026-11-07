import React, { useRef, useState, useId } from 'react';
import {
  List,
  ListOrdered,
  Bold,
  Italic,
  Heading3,
  Quote,
  Eye,
  Edit3,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { parseMarkdown } from '@/lib/markdown';
import { cn } from '@/lib/utils';

export function FormattedTextarea({
  id,
  value = '',
  onChange,
  placeholder,
  rows = 4,
  required = false,
  className = '',
  preset = 'compact', // 'compact' | 'full'
  disabled = false,
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  const notifyChange = (nextValue, cursorStart, cursorEnd) => {
    if (onChange) {
      onChange({ target: { value: nextValue } });
    }
    if (cursorStart !== undefined) {
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            cursorStart,
            cursorEnd !== undefined ? cursorEnd : cursorStart
          );
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: currentVal } = textarea;

    // Handle Enter key for automatic point continuation
    if (e.key === 'Enter' && !e.shiftKey) {
      const lineStart = currentVal.lastIndexOf('\n', selectionStart - 1) + 1;
      let lineEnd = currentVal.indexOf('\n', selectionStart);
      if (lineEnd === -1) lineEnd = currentVal.length;

      const currentLine = currentVal.substring(lineStart, selectionStart);
      const fullLine = currentVal.substring(lineStart, lineEnd);

      // Check unordered list: "- ", "* ", "• "
      const bulletMatch = currentLine.match(/^([ \t]*)([-*•])\s*(.*)$/);
      if (bulletMatch) {
        e.preventDefault();
        const indent = bulletMatch[1];

        // If the entire line is just an empty bullet, pressing Enter clears the bullet (exit list)
        if (/^([ \t]*)([-*•])\s*$/.test(fullLine)) {
          const nextVal =
            currentVal.substring(0, lineStart) + currentVal.substring(lineEnd);
          notifyChange(nextVal, lineStart, lineStart);
          return;
        }

        // Continue bullet on next line
        const insertion = `\n${indent}- `;
        const nextVal =
          currentVal.substring(0, selectionStart) +
          insertion +
          currentVal.substring(selectionEnd);
        const newPos = selectionStart + insertion.length;
        notifyChange(nextVal, newPos, newPos);
        return;
      }

      // Check ordered list: "1. ", "2. ", etc.
      const numberMatch = currentLine.match(/^([ \t]*)(\d+)\.\s*(.*)$/);
      if (numberMatch) {
        e.preventDefault();
        const indent = numberMatch[1];
        const num = parseInt(numberMatch[2], 10);

        // If the entire line is just an empty number, pressing Enter clears the number (exit list)
        if (/^([ \t]*)(\d+)\.\s*$/.test(fullLine)) {
          const nextVal =
            currentVal.substring(0, lineStart) + currentVal.substring(lineEnd);
          notifyChange(nextVal, lineStart, lineStart);
          return;
        }

        // Continue next number
        const nextNum = num + 1;
        const insertion = `\n${indent}${nextNum}. `;
        const nextVal =
          currentVal.substring(0, selectionStart) +
          insertion +
          currentVal.substring(selectionEnd);
        const newPos = selectionStart + insertion.length;
        notifyChange(nextVal, newPos, newPos);
        return;
      }
    }

    // Handle Tab key for list indentation
    if (e.key === 'Tab') {
      const lineStart = currentVal.lastIndexOf('\n', selectionStart - 1) + 1;
      let lineEnd = currentVal.indexOf('\n', selectionEnd);
      if (lineEnd === -1) lineEnd = currentVal.length;

      const lines = currentVal.substring(lineStart, lineEnd).split('\n');

      e.preventDefault();
      if (e.shiftKey) {
        // Unindent 2 spaces
        const newLines = lines.map((l) => l.replace(/^ {1,2}/, ''));
        const joined = newLines.join('\n');
        const nextVal =
          currentVal.substring(0, lineStart) + joined + currentVal.substring(lineEnd);
        const diff = currentVal.substring(lineStart, lineEnd).length - joined.length;
        notifyChange(nextVal, Math.max(lineStart, selectionStart - 2), Math.max(lineStart, selectionEnd - diff));
      } else {
        // Indent 2 spaces
        const newLines = lines.map((l) => '  ' + l);
        const joined = newLines.join('\n');
        const nextVal =
          currentVal.substring(0, lineStart) + joined + currentVal.substring(lineEnd);
        const diff = joined.length - currentVal.substring(lineStart, lineEnd).length;
        notifyChange(nextVal, selectionStart + 2, selectionEnd + diff);
      }
    }
  };

  const toggleBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: currentVal } = textarea;
    const lineStart = currentVal.lastIndexOf('\n', selectionStart - 1) + 1;
    let lineEnd = currentVal.indexOf('\n', selectionEnd);
    if (lineEnd === -1) lineEnd = currentVal.length;

    const selectedBlock = currentVal.substring(lineStart, lineEnd);
    const lines = selectedBlock.split('\n');

    const allBullets = lines.every((l) => /^[ \t]*[-*•]\s+/.test(l));

    let newLines;
    if (allBullets) {
      // Remove bullets
      newLines = lines.map((l) => l.replace(/^([ \t]*)[-*•]\s+/, '$1'));
    } else {
      // Add bullets (strip numbers or other bullets first if present)
      newLines = lines.map((l) => {
        const cleaned = l.replace(/^([ \t]*)(?:[-*•]|\d+\.)\s+/, '$1');
        return cleaned.replace(/^([ \t]*)(.*)$/, '$1- $2');
      });
    }

    const joined = newLines.join('\n');
    const nextVal =
      currentVal.substring(0, lineStart) + joined + currentVal.substring(lineEnd);
    notifyChange(nextVal, lineStart, lineStart + joined.length);
  };

  const toggleNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: currentVal } = textarea;
    const lineStart = currentVal.lastIndexOf('\n', selectionStart - 1) + 1;
    let lineEnd = currentVal.indexOf('\n', selectionEnd);
    if (lineEnd === -1) lineEnd = currentVal.length;

    const selectedBlock = currentVal.substring(lineStart, lineEnd);
    const lines = selectedBlock.split('\n');

    const allNumbered = lines.every((l) => /^[ \t]*\d+\.\s+/.test(l));

    let newLines;
    if (allNumbered) {
      // Remove numbers
      newLines = lines.map((l) => l.replace(/^([ \t]*)\d+\.\s+/, '$1'));
    } else {
      // Add numbers
      let counter = 1;
      newLines = lines.map((l) => {
        const cleaned = l.replace(/^([ \t]*)(?:[-*•]|\d+\.)\s+/, '$1');
        return cleaned.replace(/^([ \t]*)(.*)$/, `$1${counter++}. $2`);
      });
    }

    const joined = newLines.join('\n');
    const nextVal =
      currentVal.substring(0, lineStart) + joined + currentVal.substring(lineEnd);
    notifyChange(nextVal, lineStart, lineStart + joined.length);
  };

  const wrapText = (prefix, suffix, defaultPlaceholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: currentVal } = textarea;
    const selected = currentVal.substring(selectionStart, selectionEnd);
    const textToWrap = selected || defaultPlaceholder;

    const insertion = `${prefix}${textToWrap}${suffix}`;
    const nextVal =
      currentVal.substring(0, selectionStart) +
      insertion +
      currentVal.substring(selectionEnd);

    const startPos = selectionStart + prefix.length;
    const endPos = startPos + textToWrap.length;
    notifyChange(nextVal, startPos, endPos);
  };

  const insertHeading = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, value: currentVal } = textarea;
    const lineStart = currentVal.lastIndexOf('\n', selectionStart - 1) + 1;
    let lineEnd = currentVal.indexOf('\n', selectionStart);
    if (lineEnd === -1) lineEnd = currentVal.length;

    const line = currentVal.substring(lineStart, lineEnd);
    let newLine;
    if (line.startsWith('### ')) {
      newLine = line.replace(/^###\s*/, '');
    } else {
      newLine = `### ${line.replace(/^#+\s*/, '')}`;
    }

    const nextVal =
      currentVal.substring(0, lineStart) + newLine + currentVal.substring(lineEnd);
    notifyChange(nextVal, lineStart + newLine.length, lineStart + newLine.length);
  };

  const insertQuote = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, value: currentVal } = textarea;
    const lineStart = currentVal.lastIndexOf('\n', selectionStart - 1) + 1;
    let lineEnd = currentVal.indexOf('\n', selectionStart);
    if (lineEnd === -1) lineEnd = currentVal.length;

    const line = currentVal.substring(lineStart, lineEnd);
    let newLine;
    if (line.startsWith('> ')) {
      newLine = line.replace(/^>\s*/, '');
    } else {
      newLine = `> ${line}`;
    }

    const nextVal =
      currentVal.substring(0, lineStart) + newLine + currentVal.substring(lineEnd);
    notifyChange(nextVal, lineStart + newLine.length, lineStart + newLine.length);
  };

  const insertLink = () => {
    wrapText('[', '](https://url-disini.com)', 'teks tautan');
  };

  const renderedPreviewHtml = parseMarkdown(value);

  return (
    <div className="rounded-xl border border-input bg-card/60 shadow-xs transition-all focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40 overflow-hidden">
      {/* Formatting & Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border/70 bg-muted/30 px-3 py-2 text-xs">
        {/* Left Formatting Action Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={toggleBulletList}
            title="Daftar Poin (Bullet List •/-)"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 font-semibold text-foreground hover:bg-accent/15 hover:text-accent hover:border-accent/40 transition-colors shadow-2xs"
          >
            <List className="size-3.5 text-accent" />
            <span>• Poin</span>
          </button>

          <button
            type="button"
            onClick={toggleNumberedList}
            title="Daftar Nomor (1. 2. 3.)"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 font-semibold text-foreground hover:bg-accent/15 hover:text-accent hover:border-accent/40 transition-colors shadow-2xs"
          >
            <ListOrdered className="size-3.5 text-accent" />
            <span>1. Nomor</span>
          </button>

          <div className="mx-1 h-4 w-px bg-border/80" />

          <button
            type="button"
            onClick={() => wrapText('**', '**', 'teks tebal')}
            title="Tebal (Bold)"
            className="inline-flex size-7 items-center justify-center rounded-lg border border-border/80 bg-background/80 font-bold text-foreground hover:bg-accent/15 hover:text-accent hover:border-accent/40 transition-colors shadow-2xs"
          >
            <Bold className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => wrapText('*', '*', 'teks miring')}
            title="Miring (Italic)"
            className="inline-flex size-7 items-center justify-center rounded-lg border border-border/80 bg-background/80 italic text-foreground hover:bg-accent/15 hover:text-accent hover:border-accent/40 transition-colors shadow-2xs"
          >
            <Italic className="size-3.5" />
          </button>

          {preset === 'full' && (
            <>
              <div className="mx-1 h-4 w-px bg-border/80" />

              <button
                type="button"
                onClick={insertHeading}
                title="Sub-judul (H3)"
                className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-background/80 px-2 py-1 font-bold text-foreground hover:bg-accent/15 hover:text-accent hover:border-accent/40 transition-colors shadow-2xs"
              >
                <Heading3 className="size-3.5 text-accent" />
                <span>H3</span>
              </button>

              <button
                type="button"
                onClick={insertQuote}
                title="Kutipan (Quote)"
                className="inline-flex size-7 items-center justify-center rounded-lg border border-border/80 bg-background/80 text-foreground hover:bg-accent/15 hover:text-accent hover:border-accent/40 transition-colors shadow-2xs"
              >
                <Quote className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={insertLink}
                title="Tautan Link"
                className="inline-flex size-7 items-center justify-center rounded-lg border border-border/80 bg-background/80 text-foreground hover:bg-accent/15 hover:text-accent hover:border-accent/40 transition-colors shadow-2xs"
              >
                <LinkIcon className="size-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Right Mode Toggle (Tulis / Pratinjau) */}
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="inline-flex rounded-lg border border-border/80 bg-background/80 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all',
                activeTab === 'write'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Edit3 className="size-3" />
              <span>Tulis</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all',
                activeTab === 'preview'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Eye className="size-3" />
              <span>Pratinjau</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === 'write' ? (
        <textarea
          ref={textareaRef}
          id={inputId}
          rows={rows}
          value={value}
          onChange={(e) => notifyChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(
            'w-full resize-y bg-transparent p-3.5 text-base leading-relaxed text-foreground placeholder:text-muted-foreground outline-none transition-[color]',
            className
          )}
        />
      ) : (
        <div
          style={{ minHeight: `${rows * 1.75}rem` }}
          className="max-h-[500px] overflow-y-auto p-4 text-base leading-relaxed text-foreground bg-background/40"
        >
          {value.trim() ? (
            <div
              className="space-y-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_h4]:font-display [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-foreground [&_strong]:text-foreground [&_strong]:font-semibold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:my-2 [&_li]:text-muted-foreground [&_li::marker]:text-accent [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_a]:text-accent [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: renderedPreviewHtml }}
            />
          ) : (
            <div className="flex h-full min-h-[100px] items-center justify-center text-sm italic text-muted-foreground">
              Belum ada teks untuk dipratinjau. Ketik sesuatu di tab &quot;Tulis&quot;.
            </div>
          )}
        </div>
      )}

      {/* Helper Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 bg-muted/20 px-3 py-1.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3 text-accent" />
          <span>Format poin otomatis aktif: ketik <code className="rounded bg-muted px-1 font-mono text-[10px] text-foreground">- </code> atau <code className="rounded bg-muted px-1 font-mono text-[10px] text-foreground">• </code> lalu Enter.</span>
        </span>
        <span className="text-muted-foreground/80">Tekan Enter pada poin kosong untuk keluar daftar</span>
      </div>
    </div>
  );
}
