import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Trip } from '../../types';
import { useMemo, useState } from 'react';

const locales = { cs };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface TripCalendarProps {
  trips: Trip[];
  onTripClick: (trip: Trip) => void;
}

export function TripCalendar({ trips, onTripClick }: TripCalendarProps) {
  const [date, setDate] = useState(new Date());

  const events = useMemo(() => {
    return trips.map((trip) => ({
      id: trip.id,
      title: `${trip.start_location} → ${trip.end_location}`,
      start: new Date(trip.start_date),
      end: new Date(trip.end_date),
      resource: trip,
    }));
  }, [trips]);

  const handleSelectEvent = (event: { resource: Trip }) => {
    onTripClick(event.resource);
  };

  const messages = {
    today: 'Dnes',
    previous: 'Předchozí',
    next: 'Další',
    month: 'Měsíc',
    week: 'Týden',
    day: 'Den',
    agenda: 'Agenda',
    date: 'Datum',
    time: 'Čas',
    event: 'Událost',
    noEventsInRange: 'Žádné jízdy v tomto období',
  };

  return (
    <div className="h-[600px] animate-fade-in">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        date={date}
        onNavigate={setDate}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.MONTH}
        messages={messages}
        culture="cs"
        popup
        selectable={false}
      />
    </div>
  );
}
