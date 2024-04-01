//Supa base
import { createClient } from '@supabase/supabase-js';;

//Environment
import { devConfig } from '@/environment/devlopment';


const envConfig = devConfig;

export const supabase = createClient(envConfig.supabaseUrl, envConfig.supabaseApi)
