<template>
  <div class="forbidden">
    <div class="error-container">
      <h1 class="error-code">403</h1>
      <h2 class="error-title">Access Forbidden</h2>
      <p class="error-message">You don't have permission to access this page. Please log in or contact the administrator.</p>
      <router-link to="/login" class="login-button">Log In</router-link>
      <router-link to="/" class="back-button">Go to Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.forbidden {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #e4e8eb);
  padding: 20px;
}

.error-container {
  text-align: center;
  background-color: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.error-title {
  font-size: 2rem;
  margin: 10px 0 20px;
  color: #333;
}

.error-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.login-button, .back-button {
  display: inline-block;
  padding: 12px 30px;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0 10px;
}

.login-button {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.2);
}

.back-button {
  background: white;
  color: #333;
  border: 2px solid #ddd;
}

.login-button:hover, .back-button:hover {
  transform: translateY(-3px);
}

.login-button:hover {
  box-shadow: 0 8px 20px rgba(106, 17, 203, 0.3);
}

.back-button:hover {
  border-color: #6a11cb;
}
</style>
