import { EventApi, EventInput } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

interface DemoAppState {
  weekendsVisible: boolean;
  currentEvents: EventApi[];
}

type Props = {
  events: EventInput[];
};

function timeTable({ events }: Props) {
  return (
    <div>
      {/* {this.renderSidebar()} */}
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          slotMinTime='00:00:00'
          slotMaxTime='25:00:00'
          headerToolbar={false}
          initialView='timeGridWeek'
          timeZone='local'
          dayHeaderFormat={{ weekday: 'short' }}
          allDaySlot={false}
          selectable={false}
          events={events}
          initialDate={new Date()}
          weekends
          // initialEvents={INITIAL_EVENTS}
          // eventContent={renderEventContent}
          // eventsSet={this.handleEvents}
        />
      </div>
    </div>
  );
}

export default timeTable;
