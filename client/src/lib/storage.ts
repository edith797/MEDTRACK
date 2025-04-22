import { LocalMedication, STORAGE_KEYS } from "@shared/schema";
import { getRandomId } from "./utils";

// Get all medications from localStorage
export function getMedications(): LocalMedication[] {
  try {
    const medications = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    return medications ? JSON.parse(medications) : [];
  } catch (error) {
    console.error("Error getting medications from localStorage:", error);
    return [];
  }
}

// Save medications to localStorage
export function saveMedications(medications: LocalMedication[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
  } catch (error) {
    console.error("Error saving medications to localStorage:", error);
  }
}

// Add a new medication
export function addMedication(medication: Omit<LocalMedication, "id">): LocalMedication {
  try {
    const medications = getMedications();
    const newMedication: LocalMedication = {
      ...medication,
      id: getRandomId(),
    };
    
    medications.push(newMedication);
    saveMedications(medications);
    
    return newMedication;
  } catch (error) {
    console.error("Error adding medication:", error);
    throw new Error("Failed to add medication");
  }
}

// Update an existing medication
export function updateMedication(id: string, medication: Omit<LocalMedication, "id">): LocalMedication {
  try {
    const medications = getMedications();
    const index = medications.findIndex(med => med.id === id);
    
    if (index === -1) {
      throw new Error("Medication not found");
    }
    
    const updatedMedication: LocalMedication = {
      ...medication,
      id,
    };
    
    medications[index] = updatedMedication;
    saveMedications(medications);
    
    return updatedMedication;
  } catch (error) {
    console.error("Error updating medication:", error);
    throw new Error("Failed to update medication");
  }
}

// Delete a medication
export function deleteMedication(id: string): void {
  try {
    const medications = getMedications();
    const filteredMedications = medications.filter(med => med.id !== id);
    
    saveMedications(filteredMedications);
  } catch (error) {
    console.error("Error deleting medication:", error);
    throw new Error("Failed to delete medication");
  }
}

// Get a single medication by ID
export function getMedicationById(id: string): LocalMedication | undefined {
  try {
    const medications = getMedications();
    return medications.find(med => med.id === id);
  } catch (error) {
    console.error("Error getting medication by ID:", error);
    return undefined;
  }
}

// Create sample medications for guest users
export function createSampleMedications(): void {
  const sampleMeds: LocalMedication[] = [
    {
      id: getRandomId(),
      name: 'Lisinopril',
      dosage: '10mg',
      schedule: [
        { time: '08:00', days: [1, 2, 3, 4, 5, 6, 7] }
      ],
      color: '#3b82f6',
      notes: 'Take with food in the morning'
    },
    {
      id: getRandomId(),
      name: 'Vitamin D',
      dosage: '2000 IU',
      schedule: [
        { time: '09:00', days: [1, 3, 5] }
      ],
      color: '#f59e0b',
      notes: 'Take with breakfast'
    },
    {
      id: getRandomId(),
      name: 'Ibuprofen',
      dosage: '400mg',
      schedule: [
        { time: '13:00', days: [2, 4, 6] },
        { time: '21:00', days: [2, 4, 6] }
      ],
      color: '#ef4444',
      notes: 'Take with food to avoid stomach irritation'
    }
  ];
  
  saveMedications(sampleMeds);
}
