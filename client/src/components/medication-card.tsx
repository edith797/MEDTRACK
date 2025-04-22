import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LocalMedication } from "@shared/schema";
import { getDayShortName, formatTime } from "@/lib/utils";
import { Pencil, Trash2, Clock, Calendar, Info } from "lucide-react";

interface MedicationCardProps {
  medication: LocalMedication;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MedicationCard({ medication, onEdit, onDelete }: MedicationCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Group schedule times by day for display
  const scheduleByDay = medication.schedule.reduce<Record<number, string[]>>((acc, item) => {
    item.days.forEach(day => {
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item.time);
    });
    return acc;
  }, {});
  
  return (
    <Card className="overflow-hidden border-t-4" style={{ borderTopColor: medication.color }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start">
          <span>{medication.name}</span>
          <Badge variant="outline" className="ml-2 font-normal">
            {medication.dosage}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 text-gray-500 shrink-0" />
            <div>
              <p className="text-sm font-medium">Schedule:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {medication.schedule.map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {formatTime(item.time)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 text-gray-500 shrink-0" />
            <div>
              <p className="text-sm font-medium">Days:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(scheduleByDay).map(([day, times]) => (
                  <Badge key={day} variant="outline" className="text-xs">
                    {getDayShortName(parseInt(day))}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {medication.notes && (
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-gray-500 shrink-0" />
              <p className="text-sm text-gray-600 line-clamp-2">{medication.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-1">
        <div className="flex w-full justify-between">
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-gray-600">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-600">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Medication</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete {medication.name}? This action cannot be undone.</p>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onDelete();
                    setShowDeleteDialog(false);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
