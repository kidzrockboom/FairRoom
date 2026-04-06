import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingList from "./BookingList";

export default function BookingsTabs() {
  return (
    <Tabs defaultValue="upcoming" className="flex flex-col gap-4">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming (2)</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <BookingList />
      </TabsContent>

      <TabsContent value="history">
        <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
          <p>No booking history to display.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
