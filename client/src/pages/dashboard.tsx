import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMedications } from "@/hooks/use-medications";
import { PlusIcon, AlertCircle, CalendarDays, Clock } from "lucide-react";
import MedicationCard from "@/components/medication-card";
import MedicationTimeline from "@/components/medication-timeline";
import { checkNotificationPermission, requestNotificationPermission } from "@/lib/notification";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { medications, loading, deleteMedication } = useMedications();
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);
  
  // Check notification permission when component mounts
  useState(() => {
    const checkPermission = async () => {
      const hasPermission = await checkNotificationPermission();
      setNotificationPermission(hasPermission);
    };
    
    checkPermission();
  });
  
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted);
  };
  
  const today = new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medication Dashboard</h1>
            <p className="text-gray-600">{formatDate(today)}</p>
          </div>
          <Button onClick={() => navigate("/add-medication")} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Medication
          </Button>
        </div>
      </header>
      
      {notificationPermission === false && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span>
                Enable notifications to get reminders when it's time to take your medications.
              </span>
              <Button variant="outline" onClick={handleRequestPermission} className="shrink-0">
                Enable Notifications
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="timeline" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Today's Timeline
          </TabsTrigger>
          <TabsTrigger value="week" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Weekly View
          </TabsTrigger>
          <TabsTrigger value="all">All Medications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Today's Medication Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p>Loading medications...</p>
                </div>
              ) : medications.length > 0 ? (
                <MedicationTimeline medications={medications} viewType="daily" />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any medications scheduled.</p>
                  <Button asChild>
                    <Link href="/add-medication">Add Your First Medication</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="week" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Medication Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p>Loading medications...</p>
                </div>
              ) : medications.length > 0 ? (
                <MedicationTimeline medications={medications} viewType="weekly" />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any medications scheduled.</p>
                  <Button asChild>
                    <Link href="/add-medication">Add Your First Medication</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full flex justify-center py-8">
                <p>Loading medications...</p>
              </div>
            ) : medications.length > 0 ? (
              medications.map((medication) => (
                <MedicationCard 
                  key={medication.id} 
                  medication={medication}
                  onEdit={() => navigate(`/edit-medication/${medication.id}`)}
                  onDelete={() => deleteMedication(medication.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any medications added yet.</p>
                <Button asChild>
                  <Link href="/add-medication">Add Your First Medication</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
