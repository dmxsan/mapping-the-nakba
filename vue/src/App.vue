<script setup lang="ts">
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import WebGISViewer from '@/components/WebGISViewer.vue'

inject()
injectSpeedInsights()
</script>

<template>
  <WebGISViewer />
</template>
