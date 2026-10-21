import type { ConversationThreadProps } from '@/features/patient-questionnaire/types';

function ConversationThread({ messages }: ConversationThreadProps) {
  return (
    <div className="flex w-full flex-col gap-3" role="log" aria-live="polite">
      {messages.map(message => (
        <div
          key={message.id}
          className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
        >
          <p
            className={
              message.role === 'user'
                ? 'bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-md px-4 py-3 text-sm whitespace-pre-wrap'
                : 'bg-form-field-background text-body-primary max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 text-sm whitespace-pre-wrap'
            }
          >
            {message.content}
          </p>
        </div>
      ))}
    </div>
  );
}

export { ConversationThread };
