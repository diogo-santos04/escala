// import { CalendarBody, CalendarContainer, CalendarHeader } from "@howljs/calendar-kit";
// import React, { useState } from "react";
// import { configureReanimatedLogger } from "react-native-reanimated";

// configureReanimatedLogger({
//   strict: false,
// });

// interface Evento {
//   id: string;
//   title: string;
//   start: {
//     dateTime: Date;
//     timeZone: string;
//   };
//   end: {
//     dateTime: Date;
//     timeZone: string;
//   };
//   color?: string;
// }

// const Calendar = () => {
//   const [events, setEvents] = useState<Evento[]>([]);

//   const handleDragCreateStart = (start) => {
//     console.log("Started creating event at:", start);
//   };

//   const handleDragCreateEnd = (event) => {
//     console.log("New event:", event);

//     const newEvent: Evento = {
//       id: Math.random().toString(), // temporary ID
//       title: "New Event",
//       start: event.start,
//       end: event.end,
//       timeZone: "America/Sao_Paulo",
//     };

//     setEvents((prevEvents) => [...prevEvents, newEvent]);
//   };

//   return (
//     <CalendarContainer
//       allowDragToCreate={true}
//       onDragCreateEventStart={handleDragCreateStart}
//       onDragCreateEventEnd={handleDragCreateEnd}
//       events={events}
//     >
//       <CalendarHeader />
//       <CalendarBody />
//     </CalendarContainer>
//   );
// };

// export default Calendar;
