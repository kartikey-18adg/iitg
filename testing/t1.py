import pandas as pd

master = pd.read_csv("master_entity_file.csv")

for col in ["timestamp_x", "timestamp_y", "start_time", "end_time"]:
    if col in master.columns:
        master[col] = pd.to_datetime(master[col], errors="coerce")

events = []

if "note_id" in master.columns:
    for _, row in master.iterrows():
        if pd.notna(row["note_id"]):
            events.append([
                row["entity_id"], row["name"], row["timestamp_x"], "Note/Helpdesk",
                row.get("text", ""), "notes"
            ])

for _, row in master.iterrows():
    if pd.notna(row.get("booking_id")):
        events.append([
            row["entity_id"], row["name"], row["start_time"], "Room/Booking Start",
            row.get("room_id", ""), "bookings"
        ])
        if pd.notna(row.get("end_time")):
            events.append([
                row["entity_id"], row["name"], row["end_time"], "Room/Booking End",
                row.get("room_id", ""), "bookings"
            ])

for _, row in master.iterrows():
    if pd.notna(row.get("checkout_id")):
        events.append([
            row["entity_id"], row["name"], row["timestamp_y"], "Library Checkout",
            row.get("book_id", ""), "library"
        ])

for _, row in master.iterrows():
    if pd.notna(row.get("timestamp_x")) and pd.notna(row.get("device_hash")):
        events.append([
            row["entity_id"], row["name"], row["timestamp_x"], "Wi-Fi/Swipe",
            row.get("device_hash", ""), "wifi/swipes"
        ])

timeline = pd.DataFrame(events, columns=["entity_id", "name", "timestamp", "activity_type", "location_or_item", "source"])

timeline = timeline.sort_values(by=["entity_id", "timestamp"])

timeline["location_or_item"] = timeline.groupby("entity_id")["location_or_item"].ffill()

timeline["confidence_score"] = 1.0
timeline.loc[timeline["location_or_item"].isna(), "confidence_score"] = 0.5
timeline.loc[timeline["location_or_item"].notna() & (timeline["source"]=="ffill"), "confidence_score"] = 0.7

timeline.to_excel("timeline_view.xlsx", index=False)
print("✅ Timeline with gap filling created successfully!")
