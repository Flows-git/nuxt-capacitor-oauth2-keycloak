<template>
  <div class="pt-8">
    <h1>You are logged in!</h1>
    <button @click="$auth.logout()">Logout</button>
    <Tutorial />

  </div>
</template>
