import namehash from 'eth-ens-namehash'
import { SID_TOP_DOMAIN } from "../constants"

export function getNodeValue(subDomainName: string): string {
  return namehash.hash(subDomainName + "." + SID_TOP_DOMAIN)
}
