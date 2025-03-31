import { useSearchParams } from 'react-router-dom';

function ErrorPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage;
  if (error === 'auth-required') {
    errorMessage = 'Authentication is required';
  } else if (error === 'invalid-credentials') {
    errorMessage = 'Invalid credentials';
  } else {
    errorMessage = 'An error occurred';
  }

  return (
    <div>
      <h1>Error</h1>
      <p>{errorMessage}</p>
    </div>
  );
}

export default ErrorPage;