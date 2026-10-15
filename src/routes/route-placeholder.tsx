interface RoutePlaceholderProps {
  title: string;
}

export default function RoutePlaceholder({ title }: RoutePlaceholderProps) {
  return (
    <div className="flex w-full justify-center px-8 py-16">
      <p className="text-heading-primary text-lg font-medium">{title}</p>
    </div>
  );
}
