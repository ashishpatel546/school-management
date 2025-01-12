'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';

interface Class {
  id: string;
  name: string;
  grade: number;
  section: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  rollNumber: string;
}

export default function PromoteStudentsPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedFromClass, setSelectedFromClass] = useState('');
  const [selectedToClass, setSelectedToClass] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedFromClass) {
      fetchStudents(selectedFromClass);
    }
  }, [selectedFromClass]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError('Failed to load classes');
    }
  };

  const fetchStudents = async (classId: string) => {
    try {
      const response = await fetch(`/api/classes/${classId}/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students');
    }
  };

  const handlePromote = async () => {
    if (!selectedToClass || selectedStudents.length === 0) {
      setError('Please select target class and students');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/promotions/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fromClassId: selectedFromClass,
          toClassId: selectedToClass,
          studentIds: selectedStudents,
        }),
      });

      if (!response.ok) throw new Error('Failed to promote students');

      setSuccess('Students promoted successfully');
      setSelectedStudents([]);
      fetchStudents(selectedFromClass);
    } catch (err) {
      setError('Failed to promote students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Promote Students</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="mb-4 bg-green-50 text-green-700 border-green-200">
          {success}
        </Alert>
      )}

      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fromClass">From Class</Label>
            <select
              id="fromClass"
              className="w-full p-2 border rounded"
              value={selectedFromClass}
              onChange={(e) => setSelectedFromClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.grade}-{cls.section} ({cls.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="toClass">To Class</Label>
            <select
              id="toClass"
              className="w-full p-2 border rounded"
              value={selectedToClass}
              onChange={(e) => setSelectedToClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.grade}-{cls.section} ({cls.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Label>Select Students</Label>
          <div className="mt-2 border rounded p-4 max-h-60 overflow-y-auto">
            {students.map((student) => (
              <div key={student.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={student.id}
                  checked={selectedStudents.includes(student.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudents([...selectedStudents, student.id]);
                    } else {
                      setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={student.id}>
                  {student.firstName} {student.lastName} ({student.registrationNumber})
                </label>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-gray-500">No students found in selected class</p>
            )}
          </div>
        </div>

        <Button
          onClick={handlePromote}
          disabled={loading || !selectedToClass || selectedStudents.length === 0}
          className="mt-6"
        >
          {loading ? 'Promoting...' : 'Promote Selected Students'}
        </Button>
      </Card>
    </div>
  );
}
