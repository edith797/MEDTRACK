import { useState, useEffect, useCallback } from 'react';
import { LocalMedication } from '@shared/schema';
import { useToast } from './use-toast';
import { 
  getMedications, 
  addMedication, 
  updateMedication, 
  deleteMedication,
  getMedicationById
} from '@/lib/storage';
import { scheduleNotifications } from '@/lib/notification';

export function useMedications() {
  const [medications, setMedications] = useState<LocalMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load medications from localStorage
  const loadMedications = useCallback(() => {
    try {
      setLoading(true);
      const meds = getMedications();
      setMedications(meds);
      
      // Schedule notifications for today's medications
      scheduleNotifications(meds);
    } catch (error) {
      console.error('Error loading medications:', error);
      toast({
        title: "Error",
        description: "Failed to load your medications. Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add a new medication
  const addNewMedication = useCallback((medication: Omit<LocalMedication, "id">) => {
    try {
      const newMed = addMedication(medication);
      setMedications(prevMeds => [...prevMeds, newMed]);
      
      // Reschedule notifications with the new medication
      scheduleNotifications([...medications, newMed]);
      
      toast({
        title: "Medication Added",
        description: `${medication.name} has been added to your medications.`
      });
      
      return newMed;
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }, [medications, toast]);

  // Update an existing medication
  const updateExistingMedication = useCallback((id: string, medication: Omit<LocalMedication, "id">) => {
    try {
      const updatedMed = updateMedication(id, medication);
      setMedications(prevMeds => prevMeds.map(med => med.id === id ? updatedMed : med));
      
      // Reschedule notifications with the updated medication
      scheduleNotifications(medications.map(med => med.id === id ? updatedMed : med));
      
      toast({
        title: "Medication Updated",
        description: `${medication.name} has been updated.`
      });
      
      return updatedMed;
    } catch (error) {
      console.error('Error updating medication:', error);
      toast({
        title: "Error",
        description: "Failed to update medication. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }, [medications, toast]);

  // Delete a medication
  const removeExistingMedication = useCallback((id: string) => {
    try {
      const medicationToDelete = medications.find(med => med.id === id);
      deleteMedication(id);
      setMedications(prevMeds => prevMeds.filter(med => med.id !== id));
      
      // Reschedule notifications without the deleted medication
      scheduleNotifications(medications.filter(med => med.id !== id));
      
      toast({
        title: "Medication Deleted",
        description: medicationToDelete 
          ? `${medicationToDelete.name} has been deleted.` 
          : "Medication has been deleted."
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: "Error",
        description: "Failed to delete medication. Please try again.",
        variant: "destructive"
      });
    }
  }, [medications, toast]);

  // Get a specific medication by ID
  const getMedication = useCallback((id: string) => {
    return getMedicationById(id);
  }, []);

  // Load medications on initial render
  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  return {
    medications,
    loading,
    addMedication: addNewMedication,
    updateMedication: updateExistingMedication,
    deleteMedication: removeExistingMedication,
    getMedication,
    reloadMedications: loadMedications
  };
}
