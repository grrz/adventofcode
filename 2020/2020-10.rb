def _input()
	f = File.open('2020-10-input')
	f.read.split("\n").map(&:to_i)
end

data = _input().sort
data.unshift 0

def t1(data)
	n = [0] * 4
	n[3] = 1
	for i in 1..data.size-1
		n[data[i]-data[i-1]] += 1
	end

	pp n, n[1] * n[3]
end

# t1 data

V = [0,0,
	1, # 2 → 0: 2 ^ 0
	2, # 3 → 1: 2 ^ 1
	4, # 4 → 2: 2 ^ 2
	7  # 5 → 3: 2 ^ 3 - 1
]
 
# pp data
n = 1
i1 = nil

for i in 1..data.size-1
	if data[i]-data[i-1] == 1
		i1 = i-1 unless i1
	else
		if i1
			pp "#{i1}…#{i-1}: #{i-i1} | #{V[i-i1]}"
			n *= V[i-i1]
			i1 = nil
		end
	end
end

if i1
	i = data.size
	pp "#{i1}…#{i-1}: #{i-i1} | #{V[i-i1]}"
	n *= V[i-i1]
	i1 = nil
end

pp n
