-- Créer le compte Super Admin pour le CEO
-- Email: doudoma9@gmail.com
-- Mot de passe: doudoma9(!

INSERT INTO "User" (
  id,
  email,
  name,
  role,
  password,
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'doudoma9@gmail.com',
  'CEO - Administrateur Principal',
  'SUPER_ADMIN',
  '$2b$12$LQv3c1yqBwlFb4hxcvl.a.8kfgFXmre9bXTBp5E2vGTLWpG5FGVS2', -- Hash de "doudoma9(!"
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'SUPER_ADMIN',
  name = 'CEO - Administrateur Principal',
  password = '$2b$12$LQv3c1yqBwlFb4hxcvl.a.8kfgFXmre9bXTBp5E2vGTLWpG5FGVS2',
  "updatedAt" = NOW();
