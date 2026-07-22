#!/usr/bin/env bash
# Run from the root of your readam-frontend repo
set -e

REPO_ROOT="$(pwd)"

echo "📁 Creating directories..."
mkdir -p src/app/ai-tutor/hub
mkdir -p src/app/ai-tutor/chat
mkdir -p src/components/ai-tutor

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "📄 Copying pages..."
cp "$SCRIPT_DIR/layout.tsx"      src/app/ai-tutor/layout.tsx
cp "$SCRIPT_DIR/hub_page.tsx"    src/app/ai-tutor/hub/page.tsx
cp "$SCRIPT_DIR/chat_page.tsx"   src/app/ai-tutor/chat/page.tsx

echo "📦 Copying components..."
cp "$SCRIPT_DIR/AiHubHeader.tsx"        src/components/ai-tutor/AiHubHeader.tsx
cp "$SCRIPT_DIR/AiHubSuggestions.tsx"   src/components/ai-tutor/AiHubSuggestions.tsx
cp "$SCRIPT_DIR/AiHubFeatureCards.tsx"  src/components/ai-tutor/AiHubFeatureCards.tsx
cp "$SCRIPT_DIR/AiHubBanner.tsx"        src/components/ai-tutor/AiHubBanner.tsx
cp "$SCRIPT_DIR/AiHubLearningStreak.tsx" src/components/ai-tutor/AiHubLearningStreak.tsx
cp "$SCRIPT_DIR/AiChatSession.tsx"      src/components/ai-tutor/AiChatSession.tsx

echo "🔧 Updating shared files..."
cp "$SCRIPT_DIR/student-nav.ts"  src/constants/student-nav.ts
cp "$SCRIPT_DIR/Sidebar.tsx"     src/components/dashboard/Sidebar.tsx

echo "✅ Done! Run: npm run dev"
