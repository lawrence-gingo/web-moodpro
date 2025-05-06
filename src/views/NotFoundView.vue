<template>
  <div class="not-found">
    <div class="error-container">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-message">The page you are looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="back-button">Go to Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
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
  background: linear-gradient(135deg, #6a11cb, #2575fc);
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

.back-button {
  display: inline-block;
  padding: 12px 30px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.2);
}

.back-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(106, 17, 203, 0.3);
}
</style>
