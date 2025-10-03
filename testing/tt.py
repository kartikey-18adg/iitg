import pandas as pd

profiles = pd.read_csv("student or staff profiles.csv")

free_text = pd.read_csv("free_text_notes (helpdesk or RSVPs).csv")
profiles = profiles.merge(free_text, on="entity_id", how="outer")  

lab_booking = pd.read_csv("lab_bookings.csv")
profiles = profiles.merge(lab_booking, on="entity_id", how="outer")

library = pd.read_csv("library_checkouts.csv")
profiles = profiles.merge(library, on="entity_id", how="outer")
profiles.to_csv("master_entity_file.csv", index=False)

print("Master file created successfully!")
