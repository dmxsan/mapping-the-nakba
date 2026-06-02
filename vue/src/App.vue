<script setup lang="ts">
import { inject } from '@vercel/analytics'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import WebGISViewer from '@/components/WebGISViewer.vue'

inject()
</script>

<template>
  <WebGISViewer />
  <SpeedInsights />
</template>
