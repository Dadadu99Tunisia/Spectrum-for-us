-- Créer un utilisateur administrateur
-- Remplacez 'votre-email@example.com' par votre vraie adresse email

INSERT INTO "User" (
  id,
  email,
  name,
  role,
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'votre-email@example.com',
  'Administrateur Principal',
  'SUPER_ADMIN',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'SUPER_ADMIN',
  "updatedAt" = NOW();
