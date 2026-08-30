-- Reference data seed: Kerala districts + common specialties. ON CONFLICT DO NOTHING.

INSERT INTO districts (code, name_en, name_ml) VALUES
  ('TVM','Thiruvananthapuram','തിരുവനന്തപുരം'),('KLM','Kollam','കൊല്ലം'),
  ('PTA','Pathanamthitta','പത്തനംതിട്ട'),('ALP','Alappuzha','ആലപ്പുഴ'),
  ('KTM','Kottayam','കോട്ടയം'),('IDK','Idukki','ഇടുക്കി'),
  ('EKM','Ernakulam','എറണാകുളം'),('TSR','Thrissur','തൃശൂർ'),
  ('PKD','Palakkad','പാലക്കാട്'),('MLP','Malappuram','മലപ്പുറം'),
  ('KKD','Kozhikode','കോഴിക്കോട്'),('WYD','Wayanad','വയനാട്'),
  ('KNR','Kannur','കണ്ണൂർ'),('KGD','Kasaragod','കാസർഗോഡ്')
ON CONFLICT (code) DO NOTHING;

INSERT INTO specialties (slug, name_en, name_ml, icon) VALUES
  ('cardiology','Cardiology','കാർഡിയോളജി','❤️'),
  ('dermatology','Dermatology','ഡെർമറ്റോളജി','🧴'),
  ('pediatrics','Pediatrics','പീഡിയാട്രിക്സ്','🧒'),
  ('orthopedics','Orthopedics','ഓർത്തോപീഡിക്സ്','🦴'),
  ('gynecology','Gynecology','ഗൈനക്കോളജി','👩'),
  ('general-physician','General Physician','ജനറൽ ഫിസിഷ്യൻ','🩺'),
  ('ent','ENT','ഇ.എൻ.ടി','👂'),
  ('ophthalmology','Ophthalmology','ഒഫ്താൽമോളജി','👁️'),
  ('neurology','Neurology','ന്യൂറോളജി','🧠'),
  ('psychiatry','Psychiatry','സൈക്യാട്രി','🧘')
ON CONFLICT (slug) DO NOTHING;
