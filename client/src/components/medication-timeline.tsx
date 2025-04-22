import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LocalMedication } from "@shared/schema";
import { formatTime, getCurrentWeekDates, getShortDateStr } from "@/lib/utils";

interface MedicationTimelineProps {
  medications: LocalMedication[];
  viewType: "daily" | "weekly";
}

export default function MedicationTimeline({ medications, viewType }: MedicationTimelineProps) {
  const today = new Date();
  const currentDay = today.getDay() === 0 ? 7 : today.getDay(); // Convert Sunday from 0 to 7
  const weekDates = getCurrentWeekDates();
  
  // Get all schedule times for today's medications
  const getAllTimes = () => {
    const times = new Set<string>();
    
    medications.forEach(medication => {
      medication.schedule.forEach(schedule => {
        if (viewType === "daily") {
          // For daily view, only include times for today
          if (schedule.days.includes(currentDay)) {
            times.add(schedule.time);
          }
        } else {
          // For weekly view, include all times
          times.add(schedule.time);
        }
      });
    });
    
    // Sort times chronologically
    return Array.from(times).sort();
  };
  
  const allTimes = getAllTimes();
  
  // Get medications scheduled for a specific time and day
  const getMedicationsForTime = (time: string, day: number) => {
    return medications.filter(medication => 
      medication.schedule.some(schedule => 
        schedule.time === time && schedule.days.includes(day)
      )
    );
  };

  // Daily view timeline
  if (viewType === "daily") {
    // No medications scheduled for today
    if (allTimes.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No medications scheduled for today.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {allTimes.map((time, index) => {
          const medsForTime = getMedicationsForTime(time, currentDay);
          const isPast = new Date(`${today.toDateString()} ${time}`) < today;
          
          return (
            <div key={time} className="relative">
              {index > 0 && <Separator className="absolute top-4 inset-x-0 -mt-8" />}
              
              <div className="flex items-start pt-4">
                <div className="min-w-28 pr-4">
                  <div className={`text-lg font-medium ${isPast ? 'text-gray-400' : 'text-gray-900'}`}>
                    {formatTime(time)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-1 gap-3">
                    {medsForTime.map(med => (
                      <Card key={med.id} className="border-l-4" style={{ borderLeftColor: med.color }}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{med.name}</p>
                              <p className="text-sm text-gray-500">{med.dosage}</p>
                            </div>
                            <Badge variant={isPast ? "outline" : "default"} className="ml-2">
                              {isPast ? "Past" : "Upcoming"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  // Weekly view timeline
  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="col-span-1"></div>
          {weekDates.map((date, i) => (
            <div key={i} className={`text-center font-medium ${i === currentDay - 1 ? 'text-primary' : ''}`}>
              <div>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</div>
              <div className="text-sm text-gray-500">{getShortDateStr(date)}</div>
            </div>
          ))}
        </div>
        
        {allTimes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No medications scheduled for this week.</p>
          </div>
        ) : (
          allTimes.map((time, timeIndex) => (
            <div key={time} className="grid grid-cols-8 gap-2 mb-4">
              <div className="col-span-1 pr-2 flex items-center">
                <span className="text-sm font-medium">{formatTime(time)}</span>
              </div>
              
              {weekDates.map((_, dayIndex) => {
                const day = dayIndex + 1;
                const medsForTimeAndDay = getMedicationsForTime(time, day);
                
                return (
                  <div key={dayIndex} className="min-h-16 border rounded-md p-1 bg-gray-50">
                    {medsForTimeAndDay.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {medsForTimeAndDay.map(med => (
                          <div 
                            key={med.id}
                            className="text-xs p-1 rounded-sm flex items-center"
                            style={{ backgroundColor: `${med.color}25`, color: med.color }}
                          >
                            <span className="truncate">{med.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
