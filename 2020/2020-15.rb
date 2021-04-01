a = '13,0,10,12,1,5,8'
# a = '3,1,2'
a = a.split(',').map(&:to_i)

ind = {}
(0..a.size-2).each { |i| ind[a[i]] = i }

n = 0
begin
	l = a.last
	a.push ind[l].nil? ? 0 : a.size - 1 - ind[l]
	ind[l] = a.size - 2
	
	n += 1; pp n if n % 1000000 == 0
# end until a.size == 2020
end until a.size == 30000000

pp ">> #{a.last}"
