import { createSignal, createEffect, onCleanup } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

interface TerminalInputProps {
  onSubmit: (value: string) => void;
  osInfo: {
    user?: string;
    host?: string;
    path?: string;
    [key: string]: any;
  };
}

export default function TerminalInput(props: TerminalInputProps): JSX.Element {
  const [inputValue, setInputValue] = createSignal('');
  const [showCursor, setShowCursor] = createSignal(true);

  let inputRef: HTMLInputElement | undefined;

  const truncatePath = (path?: string) =>
    path?.split('/').slice(-2).join('/') || path;

  createEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev());
    }, 100);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="flex items-center whitespace-nowrap overflow-hidden text-white">
      <span class="text-green-400">{props.osInfo.user}</span>
      <span>@</span>
      <span class="text-blue-400">{props.osInfo.host}</span>
      <span class="px-1">:</span>
      <span class="text-yellow-400 truncate max-w-[200px]">{truncatePath(props.osInfo.path)}</span>
      <span class="ml-1 text-green-400">$</span>
      <input
        ref={inputRef}
        class="flex-1 bg-black text-white outline-none font-mono text-sm ml-2 py-1 placeholder-gray-500"
        type="text"
        value={inputValue()}
        onInput={(e) => setInputValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            props.onSubmit(inputValue());
            setInputValue('');
          }
        }}
        placeholder=" Type your command..."
        autofocus
        spellcheck={false}
      />
    </div>
  );
}

