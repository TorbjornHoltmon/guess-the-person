import { useState } from 'hono/jsx'
import { User as UserType } from './types'

interface UserProfileProps {
  onSubmit: (user: UserType) => void
}

export const UserProfile = ({ onSubmit }: UserProfileProps) => {
  const [formData, setFormData] = useState<UserType>({
    name: '',
    personalityType: '',
    eyeColor: '',
    cartoonCharacter: '',
    guiltyPleasureSong: '',
    imageUrl: `https://source.unsplash.com/random/300x300/?portrait&${Math.random()}`,
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const refreshImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: `https://source.unsplash.com/random/300x300/?portrait&${Math.random()}`,
    }))
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-8">
      <div className="flex items-center justify-center mb-6">
        <svg
          className="h-12 w-12 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <h2 className="text-2xl font-bold ml-2">Create Your Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden mb-4 bg-slate-900/70">
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={refreshImage}
                className="absolute bottom-2 right-2 bg-blue-700 p-2 rounded-full hover:bg-blue-800 transition"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-400 text-center">This image will be used for others to guess</p>
          </div>

          <div className="md:w-2/3 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="personalityType" className="block text-sm font-medium text-gray-300 mb-1">
                Personality Type
              </label>
              <select
                id="personalityType"
                name="personalityType"
                value={formData.personalityType}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white"
              >
                <option value="">Select your personality type</option>
                <option value="INTJ">INTJ - The Architect</option>
                <option value="INTP">INTP - The Logician</option>
                <option value="ENTJ">ENTJ - The Commander</option>
                <option value="ENTP">ENTP - The Debater</option>
                <option value="INFJ">INFJ - The Advocate</option>
                <option value="INFP">INFP - The Mediator</option>
                <option value="ENFJ">ENFJ - The Protagonist</option>
                <option value="ENFP">ENFP - The Campaigner</option>
                <option value="ISTJ">ISTJ - The Inspector</option>
                <option value="ISFJ">ISFJ - The Defender</option>
                <option value="ESTJ">ESTJ - The Executive</option>
                <option value="ESFJ">ESFJ - The Consul</option>
                <option value="ISTP">ISTP - The Virtuoso</option>
                <option value="ISFP">ISFP - The Adventurer</option>
                <option value="ESTP">ESTP - The Entrepreneur</option>
                <option value="ESFP">ESFP - The Entertainer</option>
              </select>
            </div>

            <div>
              <label htmlFor="eyeColor" className="block text-sm font-medium text-gray-300 mb-1">
                Eye Color
              </label>
              <input
                type="text"
                id="eyeColor"
                name="eyeColor"
                value={formData.eyeColor}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white"
                placeholder="e.g. Blue, Brown, Green"
              />
            </div>

            <div>
              <label htmlFor="cartoonCharacter" className="block text-sm font-medium text-gray-300 mb-1">
                If you were a cartoon character, who would you be?
              </label>
              <input
                type="text"
                id="cartoonCharacter"
                name="cartoonCharacter"
                value={formData.cartoonCharacter}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white"
                placeholder="e.g. SpongeBob, Batman"
              />
            </div>

            <div>
              <label htmlFor="guiltyPleasureSong" className="block text-sm font-medium text-gray-300 mb-1">
                What's your guilty pleasure song?
              </label>
              <input
                type="text"
                id="guiltyPleasureSong"
                name="guiltyPleasureSong"
                value={formData.guiltyPleasureSong}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white"
                placeholder="e.g. Barbie Girl - Aqua"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Submit Profile
          </button>
        </div>
      </form>
    </div>
  )
}
