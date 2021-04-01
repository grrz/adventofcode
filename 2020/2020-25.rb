_input = [18356117, 5909654]
# _input = [5764801, 17807724] # test


# def loop(v, subj)end

def transform(subj, loop_size)
	v = 1
	for i in (1..loop_size)
		# v = loop(v, subj)
		v *= subj
		v %= 20201227
	end
	v
end

def transform_find(subj, data)
	v = 1
	n = 1
	out = []

	nkeys = data.size
	while true
		# v = loop(v, subj)
		v *= 7 # subj
		v %= 20201227

		if data.index v
			p "found key for #{data[data.index v]}: #{n}"
			out[data.index v] = n
			nkeys -= 1
			break if nkeys == 0
		end
		n += 1
	end
	out
end

keys = transform_find 7, _input
# "found key for 18356117: 3974372"
# "found key for 5909654: 8623737"

p transform _input[0], keys[1]
p transform _input[1], keys[0]
