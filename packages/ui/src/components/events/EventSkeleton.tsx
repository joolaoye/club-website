import { Card } from "@workspace/ui/components/card";

export function EventSkeleton() {
  return (
    <Card className="p-6">
      <div className="animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </Card>
  );
} 