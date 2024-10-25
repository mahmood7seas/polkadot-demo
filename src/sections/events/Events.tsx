/** @format */

import { useEffect, useState } from "react";
import { usePolkadot } from "../../context";

interface eventsType {
  new: string;
  length: string;
  section: string;
  method: string;
  phase: string;
}

const Events = () => {
  const { api } = usePolkadot();
  const [blockEvents, setBlockEvents] = useState<eventsType[]>([]);

  useEffect(() => {
    const monitorEvents = async () => {
      if (!api) return;

      api.query.system.events((events: any) => {
        const newEvents: eventsType[] = [];

        events.forEach((record: any, index: any) => {
          const { event, phase } = record;
          const eve = {
            new: `\nReceived ${events.length} new events:`,
            length: `\nEvent ${index + 1}:`,
            section: `Section: ${event.section}`,
            method: `Method: ${event.method}`,
            phase: `Phase: ${phase.toString()}`,
          };
          newEvents.push(eve);
        });

        // Update the state with the new events
        setBlockEvents((prevEvents) => [...prevEvents, ...newEvents]);
      });
    };

    monitorEvents();
  }, [api]);

  return (
    <div>
      {blockEvents.map((item, index) => {
        return (
          <div key={index} className="border-b text-xs mb-3 pb-2">
            <p>{item.new}</p>
            <p>{item.length}</p>
            <p>{item.method}</p>
            <p>{item.section}</p>
            <p>{item.phase}</p>
          </div>
        );
      })}
    </div>
  );
};

export { Events };
