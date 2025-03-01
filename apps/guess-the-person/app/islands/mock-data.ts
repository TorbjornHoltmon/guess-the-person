import { User, Users } from './types'

// Generate 15 mock users with diverse profiles
export const mockUsers: Users = {
  ABC123: {
    code: 'ABC123',
    name: 'Alex Johnson',
    personalityType: 'INTJ',
    eyeColor: 'Blue',
    cartoonCharacter: 'Batman',
    guiltyPleasureSong: 'Never Gonna Give You Up - Rick Astley',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
  },
  DEF456: {
    code: 'DEF456',
    name: 'Sarah Williams',
    personalityType: 'ENFP',
    eyeColor: 'Green',
    cartoonCharacter: 'Wonder Woman',
    guiltyPleasureSong: 'Barbie Girl - Aqua',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
  },
  GHI789: {
    code: 'GHI789',
    name: 'Michael Chen',
    personalityType: 'ESTP',
    eyeColor: 'Brown',
    cartoonCharacter: 'Iron Man',
    guiltyPleasureSong: 'Baby - Justin Bieber',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx',
  },
}
