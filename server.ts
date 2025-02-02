import { env } from "@/env"
import { app } from "./src/app"

app.listen({ port: env.PORT, host: "0.0.0.0" }, (err, port) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🚀 Server running on port: ${port}!`)
})