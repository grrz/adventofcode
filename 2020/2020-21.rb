def _input()
	# f = ['mxmxvkd kfcds sqjhc nhms (contains dairy, fish)','trh fvjkl sbzzf mxmxvkd (contains dairy)','sqjhc fvjkl (contains soy)','sqjhc mxmxvkd sbzzf (contains fish)']
	f = File.open('2020-21-input').read.split("\n")

	f.map { |l|
		m = l.match(/([\s\w]+) \(contains ([\w\s,]+)\)/)
		[m[1].split(' ').map(&:to_sym), m[2].split(', ').map(&:to_sym)]
	}
end

data = _input

# a: allergen → [possible ingredients]
a = {}
# a_times: allergen → times found
a_times = {}

data.each { |i|
	i[1].each { |_a|
		if a[_a].nil?
			a[_a] = i[0]
			a_times[_a] = 1
		else
			a[_a] &= i[0]
			a_times[_a] += 1
		end
	}
}

a_keys = a.keys.sort { |k1, k2| a[k1].size <=> a[k2].size }
for i in 0..a_keys.size-1
	s = a[a_keys[i]]
	next if s.is_a?(Array) && s.size > 1

	v = s.is_a?(Array) ? s : [s]

	for ii in 0..a_keys.size-1
		next if i == ii
		a[a_keys[ii]] -= v if a[a_keys[ii]].is_a?(Array)
		a[a_keys[ii]] = a[a_keys[ii]][0] if a[a_keys[ii]].size == 1
	end

	a[a_keys[i]] = v[0]
end

# aa = a.map { |k, v| v }

#1
# no_a = []; data.each { |d| no_a += d[0] - aa }
# p no_a, no_a.size

#2
p a.keys.sort.map { |k| a[k] }.join ','