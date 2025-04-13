# Authentication Guide

## Overview

This guide explains how to use the `useAuth` hook to authenticate users and fetch data securely.

## Getting Started

### Import the Auth Hook

```jsx
import { useAuth } from '../context/AuthContext';
```

### Using the Auth Hook

```jsx
function MyComponent() {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <p>Please log in to access this content.</p>;
    }

    // User is authenticated, proceed with fetching data
    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <DataComponent userId={user.id} />
        </div>
    );
}

// Now use user.id in select queries etc for further dbms commmands
```

## Fetching Data with Authentication

Haven't Implemented RLS yet but to do 

## Best Practices

1. Always check `isAuthenticated` before attempting to access protected resources
2. Handle loading states to improve user experience
4. Implement proper error handling for failed requests

## Common Issues

- Token expiration: Ensure your auth context handles token refresh

:)