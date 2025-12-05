import geoip from 'geoip-lite'

geoip.startWatchingDataUpdate()

export async function getGeoLocation (ipAddress) {
  const location = geoip.lookup(ipAddress)
  return { countryCode: location?.country || 'IN', region: location?.region || 'MP' }
}
