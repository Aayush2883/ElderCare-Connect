import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FileText, Calendar, User } from 'lucide-react';

const CareNotes = () => {
  const [bookings, setBookings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const { data: bookingsData } = await API.get('/api/bookings');
        setBookings(bookingsData);
        
        // Retrieve care notes for all completed/ongoing bookings
        const careNotesPromises = bookingsData.map(async (b) => {
          try {
            const { data } = await API.get(`/api/care-notes/booking/${b._id}`);
            return data.map(n => ({ ...n, patientName: b.patientId?.patientName, serviceName: b.serviceId?.serviceName }));
          } catch (e) {
            return [];
          }
        });
        
        const resolved = await Promise.all(careNotesPromises);
        const flattened = resolved.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotes(flattened);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAllNotes();
  }, []);

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading care notes archives...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary-500" />
          <span>Patient Care Notes Log</span>
        </h1>
        <p class="text-slate-500 font-medium">Review the history of daily logs, clinical vitals, and reports you submitted for patients.</p>
      </div>

      {notes.length === 0 ? (
        <div class="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p class="text-slate-500 font-semibold text-lg">No care notes logged yet.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <div key={note._id} class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition">
              <div class="flex justify-between items-start border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2 text-slate-700 font-extrabold">
                  <User className="h-5 w-5 text-slate-400" />
                  <span>{note.patientName}</span>
                </div>
                <span class="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                  {note.serviceName}
                </span>
              </div>
              <p class="text-slate-650 leading-relaxed font-semibold text-slate-700">{note.notes}</p>
              <div class="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5 pt-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Logged on: {new Date(note.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareNotes;
