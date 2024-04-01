import '../styles/globals.css'
import { Inter } from 'next/font/google'

//Component
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Asymtos',
}

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/images/icon.png" type="image" sizes="any" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
