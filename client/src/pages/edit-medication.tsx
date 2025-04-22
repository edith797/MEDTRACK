import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useMedications } from "@/hooks/use-medications";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { LocalMedication, ScheduleItem } from "@shared/schema";

export default function EditMedication() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { getMedication, updateMedication } = useMedications();
  
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState("");
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    if (params.id) {
      const medication = getMedication(params.id);
      
      if (medication) {
        setName(medication.name);
        setDosage(medication.dosage);
        setNotes(medication.notes || "");
        setColor(medication.color);
        setSchedules([...medication.schedule]); // Create a copy to avoid mutations
      } else {
        setNotFound(true);
      }
      
      setLoading(false);
    }
  }, [params.id, getMedication]);
  
  const handleAddSchedule = () => {
    setSchedules([...schedules, { time: "12:00", days: [1, 2, 3, 4, 5, 6, 7] }]);
  };
  
  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };
  
  const handleScheduleTimeChange = (index: number, time: string) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index].time = time;
    setSchedules(updatedSchedules);
  };
  
  const handleDayToggle = (index: number, day: number) => {
    const updatedSchedules = [...schedules];
    const currentDays = updatedSchedules[index].days;
    
    if (currentDays.includes(day)) {
      updatedSchedules[index].days = currentDays.filter(d => d !== day);
    } else {
      updatedSchedules[index].days = [...currentDays, day].sort();
    }
    
    setSchedules(updatedSchedules);
  };
  
  const handleAllDaysToggle = (index: number, checked: boolean) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index].days = checked ? [1, 2, 3, 4, 5, 6, 7] : [];
    setSchedules(updatedSchedules);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      alert("Please enter a medication name");
      return;
    }
    
    if (!dosage.trim()) {
      alert("Please enter a dosage");
      return;
    }
    
    if (schedules.length === 0) {
      alert("Please add at least one schedule");
      return;
    }
    
    if (schedules.some(schedule => schedule.days.length === 0)) {
      alert("Please select at least one day for each schedule");
      return;
    }
    
    const updatedMedication: Omit<LocalMedication, "id"> = {
      name,
      dosage,
      schedule: schedules,
      color,
      notes: notes.trim() || undefined
    };
    
    updateMedication(params.id, updatedMedication);
    navigate("/dashboard");
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading medication...</p>
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Medication not found.</p>
        <Button 
          className="mt-4"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Medication</h1>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Medication Details</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Medication Name</Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter medication name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input 
                  id="dosage"
                  value={dosage}
                  onChange={e => setDosage(e.target.value)}
                  placeholder="e.g., 10mg, 1 tablet, 5ml"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add any additional notes or instructions"
                  rows={3}
                />
              </div>
            </div>
            
            <div>
              <Label className="block mb-2">Schedule</Label>
              
              {schedules.map((schedule, index) => (
                <div key={index} className="border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Time #{index + 1}</h4>
                    {schedules.length > 1 && (
                      <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSchedule(index)}
                        className="text-red-500 h-8 px-2"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor={`time-${index}`}>Time</Label>
                    <Input 
                      id={`time-${index}`}
                      type="time"
                      value={schedule.time}
                      onChange={e => handleScheduleTimeChange(index, e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Days of the Week</Label>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`everyday-${index}`} className="text-sm">Everyday</Label>
                        <Switch 
                          id={`everyday-${index}`}
                          checked={schedule.days.length === 7}
                          onCheckedChange={checked => handleAllDaysToggle(index, checked)}
                        />
                      </div>
                    </div>
                    
                    <RadioGroup className="flex flex-wrap gap-2">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dayIndex) => {
                        const dayNumber = dayIndex + 1;
                        return (
                          <div key={dayNumber} className="flex items-center">
                            <RadioGroupItem 
                              id={`day-${index}-${dayNumber}`}
                              value={`${dayNumber}`}
                              type="button"
                              className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm
                                ${schedule.days.includes(dayNumber) 
                                  ? 'bg-primary text-white' 
                                  : 'border border-gray-300 text-gray-700'}
                              `}
                              onClick={() => handleDayToggle(index, dayNumber)}
                            >
                              {day}
                            </RadioGroupItem>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddSchedule}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Time
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit">Update Medication</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
