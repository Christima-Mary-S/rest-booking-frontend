import React from "react";
import { formatTime } from "../../utils/helpers.js";

const TimeSlotSelector = ({ slots, selectedSlot, onSlotSelect }) => {
  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No available time slots for this date.</p>
        <p className="text-sm mt-2">Please try a different date.</p>
      </div>
    );
  }

  const groupSlotsByPeriod = (timeSlots) => {
    const periods = {
      lunch: { label: "Lunch", slots: [] },
      dinner: { label: "Dinner", slots: [] },
    };

    timeSlots.forEach((slot) => {
      const hour = parseInt(slot.split(":")[0]);
      if (hour < 17) {
        periods.lunch.slots.push(slot);
      } else {
        periods.dinner.slots.push(slot);
      }
    });

    return periods;
  };

  const groupedSlots = groupSlotsByPeriod(slots);

  const renderSlotGroup = (group, slots) => {
    if (slots.length === 0) return null;

    return (
      <div key={group} className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{group}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => onSlotSelect(slot)}
              className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                selectedSlot === slot
                  ? "bg-orange-500 text-white border-orange-500 shadow-md transform scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <div className="font-medium">{formatTime(slot)}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {Object.entries(groupedSlots).map(([period, { label, slots }]) =>
        renderSlotGroup(label, slots)
      )}

      {selectedSlot && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <span className="font-medium">Selected time:</span>{" "}
            {formatTime(selectedSlot)}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
