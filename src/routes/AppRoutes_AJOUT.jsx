// Ajouter cet import dans AppRoutes.jsx
import { CandidaturesRecuesPage } from '../pages/employeur/CandidaturesRecuesPage';

// Ajouter cette route dans <Routes> :
<Route
  path="/employeur/candidatures"
  element={
    <ProtectedRoute roles={['Employeur', 'Administrateur', 'SuperAdministrateur']}>
      <CandidaturesRecuesPage />
    </ProtectedRoute>
  }
/>
