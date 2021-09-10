/* tslint:disable no-console */

import { Publisher } from "@pact-foundation/pact"
import { versionFromGitTag } from "@pact-foundation/absolute-version"
import { resolve } from "path"
import { execSync } from "child_process"

const exec = command =>
  execSync(command)
    .toString()
    .trim()

if (process.env.CI !== "true") {
  console.log("Skipping Pact publish as not on CI")
  process.exit(0)
}

// Your version numbers need to be unique for every different version of your consumer
// see https://docs.pact.io/getting_started/versioning_in_the_pact_broker/ for details.
// If you use git tags, then you can use @pact-foundation/absolute-version as we do here.
//const consumerVersion = versionFromGitTag()
const consumerVersion = "1.0"
// Usually, you would just use the CI env vars, but to allow these examples to run from
// local development machines, we'll fall back to the git command when the env vars aren't set.
// const branch =
//   process.env.TRAVIS_BRANCH || exec("git rev-parse --abbrev-ref HEAD")

new Publisher({
  pactFilesOrDirs: [resolve(process.cwd(), "pact/pacts")],
  pactBroker: process.env.PACTBROKERURL,
  pactBrokerToken: process.env.PACTBROKERTOKEN,
 // tags: [(branch as string) || "master"],
  consumerVersion,
})
  .publishPacts()
  .then(
    () => {
      console.log(
        `Pact contract for consumer version ${consumerVersion} published!`
      )
      console.log("")
      console.log("Head over to `${process.env.PACTBROKERURL}` and login with")
      console.log("to see your published contracts.")
    },
    e => {
      console.error("Pact contract publishing failed: ", e)
    }
  )
