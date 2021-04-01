def _input()
	f = File.open('2020-18-input')
	f.read.split("\n")
end

def process_string_plain(str)
	#2
	m = str.match /(\d+) \+ (\d+)/
	while m
		str = m.pre_match + (m[1].to_i + m[2].to_i).to_s + m.post_match
		m = str.match /(\d+) \+ (\d+)/
	end
	#/2

	s = str.split ' '

	res = s.shift.to_i
	while s.size > 0
		oper = s.shift
		case oper
		when '+'
			res += s.shift.to_i
		# when '-'
		# 	res -= s.shift.to_i
		when '*'
			res *= s.shift.to_i
		# when '/'
		# 	res += s.shift.to_i
		end
	end

	res
end

def process_string(str)
	m = str.match /\(([^()]*)\)/
	while m
		str = m.pre_match + process_string_plain(m[1]).to_s + m.post_match
		m = str.match /\(([^()]*)\)/
	end

	process_string_plain(str)
end

# pp process_string '2 * 3 + (4 * 5)'
# pp process_string '5 + (8 * 3 + 9 + 3 * 4 * 3)'
# pp process_string '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'
# pp process_string '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'

pp _input.map { |i| process_string i }.sum